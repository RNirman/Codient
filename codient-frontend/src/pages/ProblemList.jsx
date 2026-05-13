import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ProblemList = () => {
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/problems')
      .then(res => {
        setProblems(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  return (
    <div className="flex-1 overflow-y-auto w-full max-w-6xl mx-auto px-6 py-10 font-sans">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Problems</h1>
        <div className="flex gap-4">
          <input 
            type="text" 
            placeholder="Search problems..." 
            className="px-4 py-2 bg-codient-card border border-white/10 rounded-lg text-sm text-white focus:outline-none focus:border-codient-primary transition-colors"
          />
          <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-sm font-medium hover:bg-white/10 transition-colors">
            Filter
          </button>
        </div>
      </div>

      <div className="bg-codient-card border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="py-4 px-6 font-medium text-gray-400 text-sm">Status</th>
              <th className="py-4 px-6 font-medium text-gray-400 text-sm">Title</th>
              <th className="py-4 px-6 font-medium text-gray-400 text-sm">Acceptance</th>
              <th className="py-4 px-6 font-medium text-gray-400 text-sm">Difficulty</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" className="py-8 text-center text-gray-500">Loading problems...</td></tr>
            ) : problems.map((problem, index) => (
              <tr key={problem.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                <td className="py-4 px-6">
                </td>
                <td className="py-4 px-6">
                  <Link to={`/problem/${problem.id}`} className="font-medium text-white group-hover:text-codient-primary transition-colors flex items-center gap-2">
                    <span>{index + 1}.</span> {problem.title}
                  </Link>
                  <div className="mt-1 flex gap-2">
                    {problem.tags && problem.tags.slice(0, 2).map((tag, i) => (
                      <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/5">
                        {tag}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="py-4 px-6 text-sm text-gray-300">--</td>
                <td className="py-4 px-6">
                  <span className={`text-sm font-medium ${
                    problem.difficulty === 'Easy' ? 'text-codient-success' :
                    problem.difficulty === 'Medium' ? 'text-yellow-400' : 'text-codient-error'
                  }`}>
                    {problem.difficulty}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProblemList;
