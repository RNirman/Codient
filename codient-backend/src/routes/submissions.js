const express = require('express');
const { Queue } = require('bullmq');
const prisma = require('../db');

const router = express.Router();

const submissionQueue = new Queue('submissions', {
  connection: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379')
  }
});

router.post('/', async (req, res) => {
  try {
    const { userId, problemId, language, code } = req.body;
    
    // 1. Create a submission record in DB
    const submission = await prisma.submission.create({
      data: {
        userId,
        problemId,
        language,
        code,
        status: 'Pending'
      }
    });

    // 2. Add job to execution queue
    await submissionQueue.add('executeCode', {
      submissionId: submission.id,
      problemId,
      code,
      language
    });

    res.status(201).json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const submissions = await prisma.submission.findMany({
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: { problem: { select: { title: true } } }
    });
    res.json(submissions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const submission = await prisma.submission.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!submission) return res.status(404).json({ error: 'Not found' });
    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
