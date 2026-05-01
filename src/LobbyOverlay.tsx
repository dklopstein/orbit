import React, { useState } from 'react';
import type { ConnectionStatus } from './useMultiplayer';

interface LobbyOverlayProps {
  status: ConnectionStatus;
  lobbyCode: string;
  onHost: () => void;
  onJoin: (code: string) => void;
  onCancel: () => void;
}

const LobbyOverlay: React.FC<LobbyOverlayProps> = ({ status, lobbyCode, onHost, onJoin, onCancel }) => {
  const [inputCode, setInputCode] = useState('');
  const [isExiting, setIsExiting] = useState(false);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputCode.trim()) {
      onJoin(inputCode.trim());
    }
  };

  const handleCancel = () => {
    setIsExiting(true);
    setTimeout(() => {
      onCancel();
    }, 500); // Match animation duration
  };

  const copyCode = () => {
    navigator.clipboard.writeText(lobbyCode);
  };

  return (
    <div className={`absolute inset-0 z-50 flex items-center justify-center bg-[var(--bg)] bg-opacity-95 backdrop-blur-sm ${isExiting ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div className="w-full max-w-md p-8 flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl tracking-[0.2em] uppercase font-black text-[var(--text-main)]">
            Mission Control
          </h2>
          <div className="w-12 h-[1px] bg-[var(--accent-primary)]"></div>
        </div>

        {status === 'disconnected' && (
          <div className="w-full flex flex-col gap-6">
            <button
              onClick={onHost}
              className="w-full py-4 border border-[var(--border)] rounded-lg hover:border-[var(--accent-primary)] hover:text-[var(--accent-primary)] transition-all group flex flex-col items-center gap-1"
            >
              <span className="text-xs tracking-[0.3em] uppercase font-bold">Initialize Host</span>
              <span className="text-[10px] text-[var(--text-dim)] group-hover:text-[var(--accent-primary)] opacity-50">Generate a new lobby code</span>
            </button>

            <div className="relative flex items-center justify-center py-4">
              <div className="absolute w-full h-[1px] bg-[var(--border)] opacity-30"></div>
              <span className="relative px-4 bg-[var(--bg)] text-[10px] tracking-widest text-[var(--text-dim)] uppercase">Or</span>
            </div>

            <form onSubmit={handleJoin} className="flex flex-col gap-3">
              <input
                type="text"
                placeholder="ENTER FREQUENCY CODE"
                value={inputCode}
                onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                className="w-full bg-transparent border border-[var(--border)] rounded-lg py-3 px-4 text-center tracking-[0.3em] text-sm focus:border-[var(--accent-secondary)] outline-none transition-colors"
              />
              <button
                type="submit"
                disabled={!inputCode.trim()}
                className="w-full py-3 bg-[var(--text-main)] text-[var(--bg)] rounded-lg text-xs tracking-[0.3em] uppercase font-black hover:opacity-90 disabled:opacity-30 transition-opacity"
              >
                Join Signal
              </button>
            </form>
          </div>
        )}

        {status === 'hosting' && (
          <div className="flex flex-col items-center gap-6 w-full animate-pulse">
            <div className="flex flex-col items-center gap-2">
              <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--text-dim)] font-bold">Broadcasting ID</span>
              <div 
                onClick={copyCode}
                className="cursor-pointer group flex flex-col items-center gap-2"
                title="Click to copy"
              >
                <span className="text-3xl font-mono tracking-widest text-[var(--accent-primary)] select-all">{lobbyCode || '....'}</span>
                <span className="text-[9px] tracking-widest uppercase text-[var(--text-dim)] group-hover:text-[var(--text-main)] transition-colors">Click to copy frequency</span>
              </div>
            </div>
            
            <div className="flex flex-col items-center gap-1">
              <div className="flex gap-1">
                {[0, 1, 2].map(i => (
                  <div key={i} className="w-1 h-1 bg-[var(--accent-primary)] rounded-full animate-bounce" style={{ animationDelay: `${i * 0.2}s` }}></div>
                ))}
              </div>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-dim)]">Awaiting remote connection</span>
            </div>
          </div>
        )}

        {status === 'joining' && (
          <div className="flex flex-col items-center gap-4">
            <div className="w-8 h-8 border-2 border-[var(--accent-secondary)] border-t-transparent rounded-full animate-spin"></div>
            <span className="text-[10px] tracking-[0.3em] uppercase text-[var(--text-dim)]">Synchronizing signal...</span>
          </div>
        )}

        {status === 'error' && (
          <div className="flex flex-col items-center gap-4">
            <span className="text-xs text-[var(--accent-secondary)] tracking-widest uppercase font-bold text-center">Connection Interference Detected</span>
            <button
              onClick={() => window.location.reload()}
              className="text-[10px] tracking-[0.2em] uppercase text-[var(--text-main)] underline"
            >
              Reboot System
            </button>
          </div>
        )}

        <button
          onClick={handleCancel}
          className="group flex flex-col items-center gap-2 mt-8 animate-fade-in"
          style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
        >
          <span className="text-[var(--text-dim)] text-[10px] tracking-[0.3em] uppercase font-bold group-hover:text-[var(--text-main)] transition-colors">
            Return to Hangar
          </span>
          <div className="w-4 h-[1px] bg-[var(--border)] group-hover:w-12 group-hover:bg-[var(--text-main)] transition-all duration-500"></div>
        </button>
      </div>
    </div>
  );
};

export default LobbyOverlay;
