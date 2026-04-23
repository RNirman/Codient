const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/auth');
const problemRoutes = require('./routes/problems');
const submissionRoutes = require('./routes/submissions');
const leaderboardRoutes = require('./routes/leaderboard');

const http = require('http');
const { initSocket } = require('./socket');

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
initSocket(server); // Attach WebSockets strictly to this server instance

// Initialize Worker after Socket is available universally
require('./queue/worker');

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Codient Backend is running' });
});

app.use('/api/auth', authRoutes);
app.use('/api/problems', problemRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/leaderboard', leaderboardRoutes);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server and WebSockets running on port ${PORT}`);
});
