import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import ProblemList from './pages/ProblemList';
import Workspace from './pages/Workspace';
import Submissions from './pages/Submissions';

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-codient-bg text-gray-100 selection:bg-codient-accent selection:text-black">
      <Navbar />
      <main className="flex-1 flex flex-col overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/problems" element={<ProblemList />} />
          <Route path="/problem/:id" element={<Workspace />} />
          <Route path="/submissions" element={<Submissions />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
