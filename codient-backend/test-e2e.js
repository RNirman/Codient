const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

async function run() {
  try {
    console.log('1. Registering user...');
    // Register
    const email = `test${Date.now()}@test.com`;
    const authRes = await axios.post(`${BASE_URL}/auth/register`, {
      name: 'Test User',
      email: email,
      password: 'password123'
    });
    const userId = authRes.data.id;
    console.log('User created:', userId);

    console.log('2. Creating problem...');
    const probRes = await axios.post(`${BASE_URL}/problems`, {
      title: 'Simple Addition',
      description: 'Add two numbers from input string',
      difficulty: 'Easy',
      testCases: [
        { input: '2 3', expectedOutput: '5' },
        { input: '10 20', expectedOutput: '30' }
      ]
    });
    const problemId = probRes.data.id;
    console.log('Problem created:', problemId);

    console.log('3. Submitting code (Wrong Answer)...');
    const wrongCode = `
import sys
a, b = map(int, sys.stdin.read().split())
print(a + b + 1)
`;
    let subRes = await axios.post(`${BASE_URL}/submissions`, {
      userId,
      problemId,
      language: 'python',
      code: wrongCode.trim()
    });
    
    let wrongSubId = subRes.data.id;
    
    console.log('4. Submitting code (Correct Answer)...');
    const correctCode = `
import sys
a, b = map(int, sys.stdin.read().split())
print(a + b)
`;
    subRes = await axios.post(`${BASE_URL}/submissions`, {
      userId,
      problemId,
      language: 'python',
      code: correctCode.trim()
    });
    let correctSubId = subRes.data.id;

    console.log('Waiting for workers to process...');
    await new Promise(r => setTimeout(r, 6000));

    console.log('5. Fetching results...');
    const wRes = await axios.get(`${BASE_URL}/submissions/${wrongSubId}`);
    console.log(`Wrong Sub Status: ${wRes.data.status} | Output: ${wRes.data.stdout}`);
    
    const cRes = await axios.get(`${BASE_URL}/submissions/${correctSubId}`);
    console.log(`Correct Sub Status: ${cRes.data.status} | Output: ${cRes.data.stdout}`);

  } catch (e) {
    if (e.response) {
      console.error(e.response.data);
    } else {
      console.error(e.message);
    }
  }
}

run();
