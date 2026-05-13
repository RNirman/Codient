const prisma = require('./src/db');

async function main() {
  const prob1 = await prisma.problem.create({
    data: {
      title: 'Two Sum',
      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nInput: 2 7 11 15\nTarget: 9\nOutput: 0 1',
      difficulty: 'Easy',
      tags: ['Array', 'Hash Table'],
      starterCode: 'import sys\n# nums and target are provided via stdin. Write your logic here.\n',
      testCases: {
        create: [
          { input: '9\n2 7 11 15', expectedOutput: '0 1' },
          { input: '6\n3 2 4', expectedOutput: '1 2' },
        ],
      },
    },
  });

  const prob2 = await prisma.problem.create({
    data: {
      title: 'Add Two Numbers',
      description: 'You are given two non-empty linked lists representing two non-negative integers. Add the two numbers and return the sum as a linked list.\n\n(Simplified terminal version: add two integers from input)',
      difficulty: 'Medium',
      tags: ['Math'],
      starterCode: 'a = int(input())\nb = int(input())\n',
      testCases: {
        create: [
          { input: '243\\n564', expectedOutput: '807' },
          { input: '0\\n0', expectedOutput: '0' },
        ],
      },
    },
  });

  console.log('Seeded database with problems');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
