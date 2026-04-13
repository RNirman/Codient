const { Worker } = require('bullmq');
const { executePython } = require('../services/dockerService');
const prisma = require('../db');

const worker = new Worker('submissions', async job => {
  const { submissionId, problemId, code, language } = job.data;

  try {
    // Update status to Running
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: 'Running' }
    });

    // Fetch problem and test cases
    const problem = await prisma.problem.findUnique({
      where: { id: problemId },
      include: { testCases: true }
    });

    let passedAll = true;
    let finalStatus = 'Accepted';
    let runtimeError = null;
    let totalTime = 0;

    for (const testCase of problem.testCases) {
      const startTime = Date.now();
      
      // Execute code against test case
      let result;
      if (language === 'python') {
        result = await executePython(code, testCase.input, problem.timeLimit);
      } else {
        // Fallback for unsupported languages for now
        result = { status: 'Internal Error', stderr: 'Language not supported yet' };
      }

      totalTime += (Date.now() - startTime);

      if (result.status !== 'Success') {
        passedAll = false;
        finalStatus = result.status;
        runtimeError = result.stderr || result.stdout;
        break;
      }

      // Check correctness
      if (result.stdout.trim() !== testCase.expectedOutput.trim()) {
        passedAll = false;
        finalStatus = 'Wrong Answer';
        runtimeError = `Expected: ${testCase.expectedOutput}, Got: ${result.stdout}`;
        break;
      }
    }

    // Update submission result
    await prisma.submission.update({
      where: { id: submissionId },
      data: {
        status: finalStatus,
        executionTime: totalTime,
        stdout: runtimeError || 'All test cases passed'
      }
    });

  } catch (error) {
    await prisma.submission.update({
      where: { id: submissionId },
      data: { status: 'Internal Error', stdout: error.message }
    });
  }
}, {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});

worker.on('completed', job => {
  console.log(`${job.id} has completed!`);
});

worker.on('failed', (job, err) => {
  console.log(`${job.id} has failed with ${err.message}`);
});
