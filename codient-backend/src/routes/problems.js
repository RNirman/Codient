const express = require('express');
const prisma = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const problems = await prisma.problem.findMany({
      select: {
        id: true,
        title: true,
        difficulty: true,
        tags: true,
      }
    });
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const problem = await prisma.problem.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        testCases: {
          select: { id: true, input: true, expectedOutput: true, isHidden: true }
        }
      }
    });
    if (!problem) return res.status(404).json({ error: 'Not found' });
    
    // Hide inputs/outputs for hidden test cases if not admin (mocked logic)
    const processedTestCases = problem.testCases.map(tc => {
      if (tc.isHidden) {
        return { id: tc.id, isHidden: true };
      }
      return tc;
    });

    res.json({ ...problem, testCases: processedTestCases });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { title, description, difficulty, timeLimit, memoryLimit, tags, starterCode, testCases } = req.body;
    const problem = await prisma.problem.create({
      data: {
        title,
        description,
        difficulty,
        timeLimit: timeLimit || 2.0,
        memoryLimit: memoryLimit || 128,
        tags,
        starterCode,
        testCases: {
          create: testCases
        }
      }
    });
    res.status(201).json(problem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
