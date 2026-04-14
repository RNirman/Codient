import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Terminal } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Register
      await axios.post('http://localhost:3000/api/auth/register', { name, email, password });
      
      // Auto login
      const res = await axios.post('http://localhost:3000/api/auth/login', { email, password });
      login(res.data.token, res.data.user);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-panel p-10 rounded-2xl">
        <div className="text-center">
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-br from-codient-primary to-codient-accent flex items-center justify-center shadow-lg shadow-codient-primary/20">
            <Terminal className="text-white" size={24} />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-white tracking-tight">Create an account</h2>
          <p className="mt-2 text-sm text-gray-400">
            Already have one? <Link to="/login" className="text-codient-primary hover:text-codient-accent font-medium transition-colors">Sign in here</Link>
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          {error && (
            <div className="bg-codient-error/10 border border-codient-error text-codient-error rounded-lg p-3 text-sm text-center">
              {error}
            </div>
          )}
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f111a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-codient-primary focus:ring-1 focus:ring-codient-primary transition-colors"
                placeholder="Ada Lovelace"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f111a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-codient-primary focus:ring-1 focus:ring-codient-primary transition-colors"
                placeholder="ada@example.com"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f111a] border border-white/10 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-codient-primary focus:ring-1 focus:ring-codient-primary transition-colors"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-codient-primary hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-codient-primary focus:ring-offset-codient-bg transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
