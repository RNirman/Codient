import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import SimpleMDE from 'react-simplemde-editor';
import 'easymde/dist/easymde.min.css';
import { useAuth } from '../context/AuthContext';
import { Settings, Plus, Trash2, Edit2, ChevronRight } from 'lucide-react';

const AdminDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [problems, setProblems] = useState([]);
  const [selectedProblemId, setSelectedProblemId] = useState(null); // null means "Create Mode"
  const [loading, setLoading] = useState(true);

  // Form State
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [tags, setTags] = useState('');
  const [starterCode, setStarterCode] = useState('');
  const [timeLimit, setTimeLimit] = useState(2.0);
  const [memoryLimit, setMemoryLimit] = useState(128);
  const [testCases, setTestCases] = useState([{ input: '', expectedOutput: '', isHidden: false }]);
  
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  const mdeOptions = useMemo(() => {
    return {
      autofocus: false,
      spellChecker: false,
      status: false,
      placeholder: "Describe the coding problem here...",
    };
  }, []);

  const fetchProblems = async () => {
    try {
      const res = await axios.get('http://localhost:3000/api/problems');
      setProblems(res.data);
    } catch (err) {
      console.error('Failed to fetch problems', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'ADMIN') {
      fetchProblems();
    }
  }, [user]);

  // If user is not admin, redirect or show error
  if (!user || user.role !== 'ADMIN') {
    return (
      <div className="flex-1 flex items-center justify-center py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Unauthorized Access</h2>
          <p className="text-gray-400">You must be an administrator to view this page.</p>
        </div>
      </div>
    );
  }

  const loadProblemForEdit = async (id) => {
    setMessage('');
    try {
      const res = await axios.get(`http://localhost:3000/api/problems/${id}`);
      const p = res.data;
      setTitle(p.title);
      setDescription(p.description);
      setDifficulty(p.difficulty);
      setTags(p.tags ? p.tags.join(', ') : '');
      setStarterCode(p.starterCode || '');
      setTimeLimit(p.timeLimit || 2.0);
      setMemoryLimit(p.memoryLimit || 128);
      setTestCases(p.testCases.length > 0 ? p.testCases : [{ input: '', expectedOutput: '', isHidden: false }]);
      setSelectedProblemId(id);
    } catch (err) {
      setMessage(`Error loading problem: ${err.message}`);
    }
  };

  const resetFormToCreateMode = () => {
    setSelectedProblemId(null);
    setTitle('');
    setDescription('');
    setTags('');
    setStarterCode('');
    setDifficulty('Easy');
    setTimeLimit(2.0);
    setMemoryLimit(128);
    setTestCases([{ input: '', expectedOutput: '', isHidden: false }]);
    setMessage('');
  };

  const handleAddTestCase = () => {
    setTestCases([...testCases, { input: '', expectedOutput: '', isHidden: false }]);
  };

  const handleRemoveTestCase = (index) => {
    setTestCases(testCases.filter((_, i) => i !== index));
  };

  const updateTestCase = (index, field, value) => {
    const updated = [...testCases];
    updated[index][field] = value;
    setTestCases(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');

    try {
      const payload = {
        title,
        description,
        difficulty,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        starterCode,
        timeLimit: parseFloat(timeLimit),
        memoryLimit: parseInt(memoryLimit),
        testCases
      };

      if (selectedProblemId) {
        await axios.put(`http://localhost:3000/api/problems/${selectedProblemId}`, payload);
        setMessage('Problem successfully updated!');
      } else {
        await axios.post('http://localhost:3000/api/problems', payload);
        setMessage('Problem successfully published!');
        resetFormToCreateMode();
      }
      fetchProblems();
    } catch (err) {
      setMessage(`Error: ${err.response?.data?.error || err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedProblemId) return;
    if (window.confirm('Are you sure you want to delete this problem? All associated test cases and submissions will also be deleted permanently.')) {
      setSubmitting(true);
      try {
        await axios.delete(`http://localhost:3000/api/problems/${selectedProblemId}`);
        setMessage('Problem deleted successfully.');
        resetFormToCreateMode();
        fetchProblems();
      } catch (err) {
        setMessage(`Error deleting problem: ${err.response?.data?.error || err.message}`);
      } finally {
        setSubmitting(false);
      }
    }
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row h-[calc(100vh-64px)] overflow-hidden font-sans">
      
      {/* LEFT SIDEBAR: Problem List */}
      <div className="w-full md:w-80 border-r border-white/10 bg-codient-bg overflow-y-auto flex flex-col shrink-0">
        <div className="p-4 border-b border-white/10">
          <button 
            onClick={resetFormToCreateMode}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded-lg font-medium transition-colors ${!selectedProblemId ? 'bg-codient-primary text-white border border-codient-primary' : 'bg-white/5 text-gray-300 hover:bg-white/10 border border-transparent'}`}
          >
            <Plus size={16} /> Create New Problem
          </button>
        </div>
        <div className="p-4 flex-1">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Existing Problems</h3>
          {loading ? (
            <p className="text-gray-400 text-sm">Loading...</p>
          ) : problems.length === 0 ? (
            <p className="text-gray-500 text-sm italic">No problems found.</p>
          ) : (
            <ul className="space-y-1">
              {problems.map(p => (
                <li key={p.id}>
                  <button
                    onClick={() => loadProblemForEdit(p.id)}
                    className={`w-full text-left flex items-center justify-between px-3 py-2 rounded-md transition-colors text-sm ${selectedProblemId === p.id ? 'bg-codient-accent/20 text-codient-accent font-medium' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                  >
                    <span className="truncate">{p.id}. {p.title}</span>
                    <ChevronRight size={14} className="opacity-50" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* RIGHT SIDE: Form Area */}
      <div className="flex-1 overflow-y-auto w-full px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-codient-accent/20 flex items-center justify-center border border-codient-accent/30">
              {selectedProblemId ? <Edit2 className="text-codient-accent" size={20} /> : <Settings className="text-codient-accent" size={20} />}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">
                {selectedProblemId ? 'Edit Problem' : 'Create New Problem'}
              </h1>
              <p className="text-gray-400 text-sm">Configure problem statement, constraints, and test cases.</p>
            </div>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-6 ${message.startsWith('Error') ? 'bg-codient-error/10 text-codient-error border border-codient-error/30' : 'bg-codient-success/10 text-codient-success border border-codient-success/30'}`}>
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Core Info */}
            <div className="bg-codient-card border border-white/10 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2 mb-4">Core Information</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Problem Title</label>
                  <input
                    type="text" required value={title} onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0f111a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-codient-primary transition-colors"
                    placeholder="e.g., Two Sum"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Difficulty</label>
                  <select 
                    value={difficulty} onChange={(e) => setDifficulty(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0f111a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-codient-primary transition-colors"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Tags (comma separated)</label>
                <input
                  type="text" value={tags} onChange={(e) => setTags(e.target.value)}
                  className="w-full px-4 py-2 bg-[#0f111a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-codient-primary transition-colors"
                  placeholder="Array, Math, Dynamic Programming"
                />
              </div>

              <div className="pt-2">
                <label className="block text-sm font-medium text-gray-300 mb-1">Description (Markdown Supported)</label>
                <div className="prose prose-invert max-w-none text-black">
                  <SimpleMDE value={description} onChange={setDescription} options={mdeOptions} />
                </div>
                <style jsx global>{`
                  .editor-toolbar {
                    background-color: #f3f4f6;
                    border-color: #374151;
                    border-radius: 0.5rem 0.5rem 0 0;
                  }
                  .CodeMirror {
                    background-color: #fff;
                    color: #000;
                    border-color: #374151;
                    border-radius: 0 0 0.5rem 0.5rem;
                    font-family: inherit;
                  }
                `}</style>
              </div>
            </div>

            {/* Execution Constraints */}
            <div className="bg-codient-card border border-white/10 rounded-xl p-6 space-y-4">
              <h2 className="text-lg font-semibold text-white border-b border-white/10 pb-2 mb-4">Execution Constraints</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Time Limit (Seconds)</label>
                  <input
                    type="number" step="0.1" required value={timeLimit} onChange={(e) => setTimeLimit(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0f111a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-codient-primary transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Memory Limit (MB)</label>
                  <input
                    type="number" required value={memoryLimit} onChange={(e) => setMemoryLimit(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0f111a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-codient-primary transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Starter Code Boilerplate</label>
                <textarea
                  rows="4" value={starterCode} onChange={(e) => setStarterCode(e.target.value)}
                  className="w-full px-4 py-3 bg-[#0f111a] border border-white/10 rounded-lg text-white font-mono text-sm placeholder-gray-500 focus:outline-none focus:border-codient-primary transition-colors"
                  placeholder="import sys\n# Build your logic here"
                />
              </div>
            </div>

            {/* Test Cases */}
            <div className="bg-codient-card border border-white/10 rounded-xl p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2 mb-4">
                <h2 className="text-lg font-semibold text-white">Test Cases</h2>
                <button 
                  type="button" 
                  onClick={handleAddTestCase}
                  className="flex items-center gap-1 text-sm bg-codient-primary/20 text-codient-primary px-3 py-1 rounded hover:bg-codient-primary hover:text-white transition-colors"
                >
                  <Plus size={16} /> Add Test Case
                </button>
              </div>

              <div className="space-y-4">
                {testCases.map((tc, index) => (
                  <div key={index} className="p-4 bg-[#0f111a] border border-white/5 rounded-lg relative group">
                    {testCases.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTestCase(index)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-codient-error transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                    <h3 className="text-sm font-medium text-gray-400 mb-3">Test Case #{index + 1}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Standard Input</label>
                        <textarea 
                          required rows="3" value={tc.input} onChange={(e) => updateTestCase(index, 'input', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded font-mono text-sm text-gray-300"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-gray-400 mb-1">Expected Output</label>
                        <textarea 
                          required rows="3" value={tc.expectedOutput} onChange={(e) => updateTestCase(index, 'expectedOutput', e.target.value)}
                          className="w-full px-3 py-2 bg-black border border-white/10 rounded font-mono text-sm text-gray-300"
                        />
                      </div>
                    </div>
                    <div className="mt-3 flex items-center gap-2">
                      <input 
                        type="checkbox" id={`hidden-${index}`} 
                        checked={tc.isHidden} onChange={(e) => updateTestCase(index, 'isHidden', e.target.checked)}
                        className="accent-codient-primary w-4 h-4"
                      />
                      <label htmlFor={`hidden-${index}`} className="text-sm text-gray-400 cursor-pointer">Hide this test case during pre-submission run</label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4 pt-4 border-t border-white/10">
               <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-4 rounded-xl font-bold bg-codient-primary text-white hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Saving constraints...' : selectedProblemId ? 'Update Problem' : 'Publish Problem'}
               </button>
               
               {selectedProblemId && (
                 <button
                    type="button"
                    onClick={handleDelete}
                    disabled={submitting}
                    className="px-6 py-4 rounded-xl font-bold bg-codient-error/10 text-codient-error hover:bg-codient-error hover:text-white transition-colors disabled:opacity-50"
                  >
                    Delete Context
                 </button>
               )}
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
