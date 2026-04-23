const Docker = require('dockerode');

// Connects to local Docker daemon automatically
const docker = new Docker({ socketPath: process.platform === 'win32' ? '//./pipe/docker_engine' : '/var/run/docker.sock' });

const LANG_CONFIG = {
  python: {
    image: 'python:3.9-slim',
    cmd: ['sh', '-c', 'echo "$CODE_B64" | base64 -d > main.py && echo "$INPUT_B64" | base64 -d | python main.py']
  },
  javascript: {
    image: 'node:18-alpine',
    cmd: ['sh', '-c', 'echo "$CODE_B64" | base64 -d > main.js && echo "$INPUT_B64" | base64 -d | node main.js']
  },
  cpp: {
    image: 'gcc:12-alpine',
    cmd: ['sh', '-c', 'echo "$CODE_B64" | base64 -d > main.cpp && g++ main.cpp -o main && echo "$INPUT_B64" | base64 -d | ./main']
  },
  java: {
    image: 'openjdk:17-alpine',
    cmd: ['sh', '-c', 'echo "$CODE_B64" | base64 -d > Main.java && javac Main.java && echo "$INPUT_B64" | base64 -d | java Main']
  }
};

async function pullImage(imageName) {
  return new Promise((resolve, reject) => {
    docker.pull(imageName, (err, stream) => {
      if (err) return reject(err);
      // followProgress handles the streamed download events
      docker.modem.followProgress(stream, (progressErr, output) => {
        if (progressErr) return reject(progressErr);
        resolve(output);
      });
    });
  });
}

/**
 * Executes multi-language code inside a secure docker container via base64 mapping
 */
async function executeCode(language, code, input, timeLimit = 2) {
  try {
    const config = LANG_CONFIG[language];
    if (!config) {
      return { status: 'Internal Error', stdout: '', stderr: `Language '${language}' is not supported.` };
    }

    const codeB64 = Buffer.from(code, 'utf8').toString('base64');
    const inputB64 = Buffer.from(input, 'utf8').toString('base64');

    const createOptions = {
      Image: config.image,
      Env: [`CODE_B64=${codeB64}`, `INPUT_B64=${inputB64}`],
      Cmd: config.cmd,
      HostConfig: {
        Memory: 128 * 1024 * 1024, // 128 MB limit
        NetworkMode: 'none', // Disable network access
      },
      AttachStdout: true,
      AttachStderr: true,
      Tty: false
    };

    let container;
    try {
      container = await docker.createContainer(createOptions);
    } catch (createErr) {
      if (createErr.statusCode === 404 || (createErr.message && createErr.message.includes('No such image'))) {
        console.log(`Pulling missing image: ${config.image}... This may take a moment.`);
        await pullImage(config.image);
        container = await docker.createContainer(createOptions);
      } else {
        throw createErr; // Re-throw if it's a different error
      }
    }

    await container.start();

    // Handle time limits and capture output
    let stdoutData = '';
    let stderrData = '';
    
    return new Promise(async (resolve) => {
      const stream = await container.logs({ follow: true, stdout: true, stderr: true });
      
      // Demultiplexing docker stream
      docker.modem.demuxStream(stream, {
        write: (chunk) => { stdoutData += chunk.toString('utf8'); }
      }, {
        write: (chunk) => { stderrData += chunk.toString('utf8'); }
      });

      let finished = false;

      // Timeout execution
      const timeoutTimer = setTimeout(async () => {
        finished = true;
        try { await container.kill(); } catch(err) {} 
        resolve({ status: 'Time Limit Exceeded', stdout: stdoutData.trim(), stderr: 'Execution timed out.' });
      }, timeLimit * 1000);

      container.wait(async (err, data) => {
        if (finished) return;
        clearTimeout(timeoutTimer);
        finished = true;

        if (data.StatusCode !== 0) {
          resolve({ status: 'Runtime Error', stdout: stdoutData.trim(), stderr: stderrData.trim(), exitCode: data.StatusCode });
        } else {
          resolve({ status: 'Success', stdout: stdoutData.trim(), stderr: stderrData.trim() });
        }
        
        try { await container.remove(); } catch(err) {}
      });
    });

  } catch (err) {
    // If image doesn't exist, this naturally throws an error stating "No such image", we can catch and gracefully handle
    return { status: 'Internal Error', stdout: '', stderr: err.message };
  }
}

module.exports = { executeCode, docker };
