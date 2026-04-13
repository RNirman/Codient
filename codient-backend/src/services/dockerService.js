const Docker = require('dockerode');

// Connects to local Docker daemon automatically
const docker = new Docker({ socketPath: process.platform === 'win32' ? '//./pipe/docker_engine' : '/var/run/docker.sock' });

/**
 * Executes python code inside a secure docker container without using volumes
 */
async function executePython(code, input, timeLimit = 2) {
  try {
    const createOptions = {
      Image: 'python:3.9-slim',
      Env: [`CODE=${code}`, `INPUT=${input}`],
      Cmd: ['sh', '-c', 'echo "$INPUT" | python -c "$CODE"'],
      HostConfig: {
        Memory: 128 * 1024 * 1024, // 128 MB limit
        NetworkMode: 'none', // Disable network access
      },
      AttachStdout: true,
      AttachStderr: true,
      Tty: false
    };

    const container = await docker.createContainer(createOptions);
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
        await container.kill();
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
        
        await container.remove();
      });
    });

  } catch (err) {
    return { status: 'Internal Error', stdout: '', stderr: err.message };
  }
}

module.exports = { executePython, docker };
