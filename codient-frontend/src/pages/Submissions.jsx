import { useEffect, useState } from 'react';
import axios from 'axios';

const Submissions = () => {
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:3000/api/submissions')
      .then(res => {
        setSubmissions(res.data);
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
        <h1 className="text-3xl font-bold text-white">Recent Submissions</h1>
      </div>

      <div className="bg-codient-card border border-white/10 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="py-4 px-6 font-medium text-gray-400 text-sm">Time Submitted</th>
              <th className="py-4 px-6 font-medium text-gray-400 text-sm">Problem</th>
              <th className="py-4 px-6 font-medium text-gray-400 text-sm">Status</th>
              <th className="py-4 px-6 font-medium text-gray-400 text-sm">Language</th>
              <th className="py-4 px-6 font-medium text-gray-400 text-sm">Runtime</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
               <tr><td colSpan="5" className="py-8 text-center text-gray-500">Loading submissions...</td></tr>
            ) : submissions.map((sub) => (
              <tr key={sub.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                <td className="py-4 px-6 text-sm text-gray-400">{new Date(sub.createdAt).toLocaleString()}</td>
                <td className="py-4 px-6 font-medium text-gray-300 hover:text-white cursor-pointer transition-colors">
                  {sub.problem?.title || `Problem ${sub.problemId}`}
                </td>
                <td className="py-4 px-6 font-medium">
                  <span className={`${
                    sub.status === 'Accepted' ? 'text-codient-success' :
                    sub.status === 'Wrong Answer' ? 'text-codient-error' : 
                    (sub.status === 'Running' || sub.status === 'Pending') ? 'text-yellow-400 animate-pulse' : 'text-codient-error'
                  }`}>
                    {sub.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-300">
                  <span className="px-2 py-1 rounded bg-white/5 border border-white/10 text-xs">
                    {sub.language}
                  </span>
                </td>
                <td className="py-4 px-6 text-sm text-gray-400">{sub.executionTime ? `${sub.executionTime} ms` : 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Submissions;
