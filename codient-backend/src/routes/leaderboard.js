const express = require('express');
const prisma = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    // We fetch all users along with their submissions and the associated difficulties
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        submissions: {
          select: {
            status: true,
            problem: { select: { id: true, difficulty: true } }
          }
        }
      }
    });

    const leaderboard = users.map(user => {
      // Isolate only accepted submissions
      const acceptedSubmissions = user.submissions.filter(sub => sub.status === 'Accepted');
      
      // Keep track of dynamically solved problems to ensure unique tallying
      const solvedProblemsMap = new Map();
      acceptedSubmissions.forEach(sub => {
        if (!solvedProblemsMap.has(sub.problem.id)) {
          solvedProblemsMap.set(sub.problem.id, sub.problem.difficulty);
        }
      });

      // Algorithmic Weighting
      let score = 0;
      solvedProblemsMap.forEach(difficulty => {
        if (difficulty === 'Easy') score += 1;
        else if (difficulty === 'Medium') score += 2;
        else if (difficulty === 'Hard') score += 3;
      });

      // Metrics
      const totalSolved = solvedProblemsMap.size;
      const totalSubmissions = user.submissions.length;
      const acceptanceRate = totalSubmissions > 0 
        ? ((acceptedSubmissions.length / totalSubmissions) * 100).toFixed(1)
        : 0.0;

      return {
        id: user.id,
        name: user.name,
        score,
        totalSolved,
        acceptanceRate: parseFloat(acceptanceRate),
      };
    });

    // Sort heavily: Order by score DESC, then by acceptanceRate DESC
    leaderboard.sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return b.acceptanceRate - a.acceptanceRate;
    });

    // Optionally restrict to top 100
    res.json(leaderboard.slice(0, 100));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
