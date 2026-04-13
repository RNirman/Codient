import { Link, useLocation } from 'react-router-dom';
import { Terminal, LayoutDashboard, History, User } from 'lucide-react';

const Navbar = () => {
  const location = useLocation();

  const navLinks = [
    { name: 'Problems', path: '/problems', icon: LayoutDashboard },
    { name: 'Submissions', path: '/submissions', icon: History },
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
        <button className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:border-white/20 hover:bg-white/5 text-sm font-medium transition-all text-gray-300 hover:text-white">
          <User size={16} />
          <span>Sign In</span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
