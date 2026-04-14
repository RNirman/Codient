import { Link, useLocation } from 'react-router-dom';
import { Terminal, LayoutDashboard, History, Settings, Trophy, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navLinks = [
    { name: 'Problems', path: '/problems', icon: LayoutDashboard },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    ...(user ? [{ name: 'Submissions', path: '/submissions', icon: History }] : []),
    ...(user?.role === 'ADMIN' ? [{ name: 'Admin', path: '/admin', icon: Settings }] : []),
  ];

  return (
    <nav className="h-16 shrink-0 border-b border-white/10 bg-codient-card flex items-center justify-between px-6 sticky top-0 z-50">
      <div className="flex items-center gap-8">
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-codient-primary flex items-center justify-center group-hover:bg-codient-accent transition-colors">
            <Terminal size={18} className="text-white group-hover:text-black transition-colors" />
          </div>
          <span className="text-xl font-bold tracking-tight text-white mb-0.5">codient</span>
        </Link>
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md transition-colors text-sm font-medium ${
                  isActive 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon size={16} />
                {link.name}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-300">
              <div className="w-8 h-8 rounded-full bg-codient-primary/20 flex items-center justify-center text-codient-primary">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span className="hidden sm:block">{user.name}</span>
            </div>
            <button 
              onClick={logout}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:border-codient-error hover:bg-codient-error/10 hover:text-codient-error text-sm font-medium transition-all text-gray-400"
            >
              <LogOut size={16} />
              <span className="hidden sm:block">Sign Out</span>
            </button>
          </div>
        ) : (
          <Link to="/login" className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 text-sm font-medium transition-all text-gray-300 hover:text-white">
            <UserIcon size={16} />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

