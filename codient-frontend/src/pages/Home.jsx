import { Link } from 'react-router-dom';
import { MonitorPlay, Zap, Shield, ChevronRight } from 'lucide-react';

const Home = () => {
  return (
    <div className="flex-1 overflow-y-auto">
      <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-codient-primary/10 text-codient-accent border border-codient-accent/20 mb-8 mt-10">
          <span className="w-2 h-2 rounded-full bg-codient-accent animate-pulse"></span>
          <span className="text-sm font-medium">Platform Early Access v0.1.0</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">
          Master Coding Interviews. <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-codient-primary to-codient-accent">Execute with Precision.</span>
        </h1>
        
        <p className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12">
          A high-performance online code judge designed for universities and developers. Fast, secure sandboxed execution with a beautiful modern interface.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <Link to="/problems" className="px-8 py-4 rounded-lg bg-codient-primary text-white font-bold hover:bg-blue-600 transition-colors flex items-center gap-2 w-full sm:w-auto justify-center">
            Start Solving <ChevronRight size={20} />
          </Link>
          <button className="px-8 py-4 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold transition-all w-full sm:w-auto justify-center text-center">
            View Leaderboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-32">
          <FeatureCard 
            icon={MonitorPlay} 
            title="Premium Editor" 
            description="VS Code-like experience directly in your browser with Monaco Editor integration." 
          />
          <FeatureCard 
            icon={Zap} 
            title="Fast Execution" 
            description="Sub-second compilation and evaluation to give you immediate feedback." 
          />
          <FeatureCard 
            icon={Shield} 
            title="Secure Sandboxing" 
            description="Isolated Docker-based execution engine ensuring safe and fair limits." 
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="glass-panel p-6 rounded-2xl glass-panel-hover text-left flex flex-col items-start gap-4">
      <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-codient-primary/20 to-codient-accent/20 flex items-center justify-center border border-white/5">
        <Icon className="text-codient-accent" size={24} />
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
        <p className="text-gray-400 leading-relaxed font-sans">{description}</p>
      </div>
    </div>
  );
};

export default Home;
