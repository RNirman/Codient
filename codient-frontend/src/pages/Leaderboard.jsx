import { useEffect, useState } from 'react';
import axios from 'axios';
import { io } from 'socket.io-client';
import { Trophy, Code, Percent } from 'lucide-react';

const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = () => {
    axios.get('http://localhost:3000/api/leaderboard')
      .then(res => {
        setLeaderboard(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load leaderboard', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLeaderboard();

    // Setup WebSockets to listen for active job completions
    const socket = io('http://localhost:3000');
    socket.on('leaderboard_update', () => {
      // Refresh the array instantly without spinning loader
      fetchLeaderboard();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto w-full max-w-6xl mx-auto px-6 py-10 font-sans">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/20">
          <Trophy className="text-white" size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Global Leaderboard</h1>
          <p className="text-gray-400 text-sm mt-1">Ranking the top developers by algorithmic weighted score.</p>
        </div>
      </div>

      <div className="bg-codient-card border border-white/10 rounded-xl overflow-hidden shadow-2xl">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="py-4 px-6 font-medium text-gray-400 text-sm w-24 text-center">Rank</th>
              <th className="py-4 px-6 font-medium text-gray-400 text-sm">Developer</th>
              <th className="py-4 px-6 font-medium text-gray-400 text-sm text-center">Score</th>
              <th className="py-4 px-6 font-medium text-gray-400 text-sm text-center">Unique Solved</th>
              <th className="py-4 px-6 font-medium text-gray-400 text-sm text-center">Acceptance</th>
            </tr>
          </thead>
          <tbody>
             {loading ? (
                <tr><td colSpan="5" className="py-12 text-center text-gray-500">Loading standings...</td></tr>
             ) : leaderboard.length === 0 ? (
                <tr><td colSpan="5" className="py-12 text-center text-gray-500 italic">No rankings available yet.</td></tr>
             ) : (
                leaderboard.map((user, index) => {
                  const rank = index + 1;
                  return (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                      <td className="py-4 px-6 text-center">
                        {rank === 1 ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-yellow-500/20 text-yellow-500 font-bold text-lg">1</span>
                        ) : rank === 2 ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-gray-300/20 text-gray-300 font-bold text-lg">2</span>
                        ) : rank === 3 ? (
                          <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-400/20 text-orange-400 font-bold text-lg">3</span>
                        ) : (
                          <span className="text-gray-500 font-medium">{rank}</span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${rank <= 3 ? 'bg-codient-bg text-white' : 'bg-white/5 text-gray-400'}`}>
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                          <span className={`font-medium ${rank <= 3 ? 'text-white' : 'text-gray-300'}`}>
                            {user.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <span className="text-codient-accent font-bold text-lg">{user.score}</span>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-1.5 text-gray-400">
                          <Code size={14} />
                          <span>{user.totalSolved}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6 text-center">
                        <div className="flex items-center justify-center gap-1 text-sm">
                          <span className={user.acceptanceRate >= 70 ? 'text-codient-success' : user.acceptanceRate >= 40 ? 'text-yellow-400' : 'text-codient-error'}>
                            {user.acceptanceRate}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  )
                })
             )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leaderboard;
