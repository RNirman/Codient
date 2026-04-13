import { Terminal as TerminalIcon } from 'lucide-react';

const TerminalOutput = ({ status, output }) => {
  return (
    <div className="h-full bg-[#1e1e1e] flex flex-col font-mono text-sm">
      <div className="h-10 border-b border-white/10 flex items-center px-4 gap-2 bg-[#2d2d2d] shrink-0">
        <TerminalIcon size={14} className="text-gray-400" />
        <span className="text-gray-300 font-medium">Test Results</span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-[#09090b]">
        {status === 'idle' && (
          <div className="text-gray-500 italic">Run your code to see output...</div>
        )}
        
        {status === 'running' && (
          <div className="flex items-center gap-2 text-yellow-400">
            <span className="animate-pulse">Evaluating submissions...</span>
          </div>
        )}
        
        {status !== 'idle' && status !== 'running' && output && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-6 pb-4 border-b border-white/10">
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Status</span>
                <span className={`font-bold ${status === 'success' ? 'text-codient-success' : 'text-codient-error'}`}>
                  {output.status}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Runtime</span>
                <span className="text-gray-300">{output.time}</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs text-gray-500 mb-1">Memory</span>
                <span className="text-gray-300">{output.memory}</span>
              </div>
            </div>
            
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 mb-2">Stdout</span>
              <pre className="text-gray-300 bg-[#1e1e1e] p-3 rounded border border-white/5 whitespace-pre-wrap font-mono">
                {output.stdout}
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TerminalOutput;
