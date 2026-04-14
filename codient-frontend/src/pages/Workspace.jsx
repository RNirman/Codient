import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import CodeEditor from '../components/CodeEditor';
import TerminalOutput from '../components/TerminalOutput';
import { Play, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ReactMarkdown from 'react-markdown';

const Workspace = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [problem, setProblem] = useState(null);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');
  
  // Execution state
  const [status, setStatus] = useState('idle'); // idle, running, success, error
  const [output, setOutput] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:3000/api/problems/${id}`)
      .then(res => {
        setProblem(res.data);
        if (res.data.starterCode) {
          setCode(res.data.starterCode);
        }
      })
      .catch(err => {
        console.error(err);
      });
  }, [id]);

  const handleRunCode = async () => {
    if (!user) {
       setStatus('error');
       setOutput({
          status: 'Authentication Required',
          time: 'N/A',
          memory: 'N/A',
          stdout: 'Please sign in to submit your code.'
       });
       // Optional: Redirect immediately or let them click the link
       // navigate('/login');
       return;
    }

    setStatus('running');
    setOutput(null);

    try {
      // Create execution request
      const res = await axios.post('http://localhost:3000/api/submissions', {
        userId: user.id, 
        problemId: parseInt(id),
        language,
        code
      });

      const submissionId = res.data.id;

      // Poll for result
      const interval = setInterval(async () => {
        const subRes = await axios.get(`http://localhost:3000/api/submissions/${submissionId}`);
        const status = subRes.data.status;
        
        if (status !== 'Pending' && status !== 'Running') {
          clearInterval(interval);
          
          if (status === 'Accepted') {
            setStatus('success');
          } else {
            setStatus('error');
          }
          
          setOutput({
            status: subRes.data.status,
            time: subRes.data.executionTime ? `${subRes.data.executionTime} ms` : 'N/A',
            memory: 'N/A',
            stdout: subRes.data.stdout || ''
          });
        }
      }, 1000);

    } catch (err) {
      setStatus('error');
      setOutput({
        status: 'Internal Error',
        time: 'N/A',
        memory: 'N/A',
        stdout: err.message
      });
    }
  };

  if (!problem) return <div className="p-8 text-white">Loading...</div>;

  return (
    <div className="flex flex-col lg:flex-row flex-1 h-[calc(100vh-64px)] overflow-hidden font-sans">
      <div className="flex-1 border-r border-white/10 bg-codient-bg overflow-y-auto flex flex-col">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-white">{problem.title}</h1>
            <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
              problem.difficulty === 'Easy' ? 'border-codient-success text-codient-success bg-codient-success/10' :
              problem.difficulty === 'Medium' ? 'border-yellow-400 text-yellow-400 bg-yellow-400/10' : 
              'border-codient-error text-codient-error bg-codient-error/10'
            }`}>
              {problem.difficulty}
            </span>
          </div>
          <div className="prose prose-invert max-w-none text-gray-300">
            <ReactMarkdown>{problem.description.replace(/\\n/g, '\n')}</ReactMarkdown>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-w-[50%] bg-[#1e1e1e]">
        <div className="h-12 border-b border-white/10 bg-[#1e1e1e] flex items-center px-4 justify-between shrink-0">
          <select 
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-[#2d2d2d] text-gray-300 text-sm rounded px-3 py-1.5 border border-[#3d3d3d] focus:outline-none focus:border-codient-primary"
          >
            <option value="python">Python 3</option>
            <option value="cpp">C++</option>
            <option value="java">Java</option>
          </select>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={handleRunCode}
              disabled={status === 'running'}
              className="flex items-center gap-2 px-4 py-1.5 rounded bg-[#2d2d2d] hover:bg-[#3d3d3d] text-gray-300 text-sm font-medium transition-colors disabled:opacity-50"
            >
              <Play size={14} className={status === 'running' ? 'animate-pulse text-yellow-400' : 'text-green-400'} />
              {status === 'running' ? 'Running...' : 'Run'}
            </button>
            <button className="flex items-center gap-2 px-4 py-1.5 rounded bg-codient-success hover:bg-emerald-600 text-white text-sm font-medium transition-colors">
              <Send size={14} />
              Submit
            </button>
          </div>
        </div>
        
        <div className="flex-1 relative">
          <CodeEditor 
            language={language}
            value={code}
            onChange={setCode}
          />
        </div>

        <div className="h-64 border-t border-white/10 flex flex-col shrink-0">
          <TerminalOutput status={status} output={output} />
        </div>
      </div>
    </div>
  );
};

export default Workspace;

