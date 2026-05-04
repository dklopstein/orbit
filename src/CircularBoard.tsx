import React, { useState, useEffect } from 'react';
import { COORDINATES } from './constants';
import type { LocationKey } from './constants';
import { useGameState } from './useGameState';
import { useMultiplayer } from './useMultiplayer';
import LobbyOverlay from './LobbyOverlay';
import RulesOverlay from './RulesOverlay';

const CircularBoard: React.FC = () => {
  const {
    board,
    turn,
    winner,
    winningMoves,
    winningType,
    gameMode,
    difficulty,
    localPlayer,
    isAiThinking,
    playMove,
    resetGame,
    setLocalPlayer,
    setDifficulty,
  } = useGameState();

  const {
    status,
    lobbyCode,
    hostLobby,
    joinLobby,
    sendMove,
    sendReset,
    disconnect,
  } = useMultiplayer({
    onRemoteMove: (location) => playMove(location, true),
    onRemoteReset: () => resetGame(),
    setLocalPlayer
  });

  const handlePlayMove = (key: LocationKey) => {
    const result = playMove(key);
    if (result && gameMode === 'online') {
      sendMove(key);
    }
  };

  const handleReset = (mode?: any) => {
    resetGame(mode);
    if (gameMode === 'online') {
      sendReset();
    }
  };

  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  });

  const [mounted, setMounted] = useState(false);
  const [showLobby, setShowLobby] = useState(false);
  const [showRules, setShowRules] = useState(false);

  useEffect(() => {
    if (gameMode === 'online' && status !== 'connected') {
      setShowLobby(true);
    } else if (status === 'connected') {
      setShowLobby(false);
    }
  }, [gameMode, status]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);

    if (!mounted) {
      setMounted(true);
      return;
    }

    document.documentElement.classList.add('theme-transitioning');
    const timer = setTimeout(() => {
      document.documentElement.classList.remove('theme-transitioning');
    }, 700);
    return () => clearTimeout(timer);
  }, [theme, mounted]);

  const scale = 1;
  const offset = 250;

  const renderCell = (key: LocationKey) => {
    const [x, y] = COORDINATES[key];
    const player = board[key];
    const isWinningMove = winningMoves?.includes(key);

    const ring = parseInt(key.slice(1, 2));
    const sliceNum = parseInt(key.slice(3));
    const scales = [0, 0.5, 0.8, 1.05, 1.25];
    const hitRadii = [0, 20, 28, 34, 38];
    const markerScale = scales[ring];
    const hitRadius = hitRadii[ring];

    const xRotation = (sliceNum * 45) + 22.5;

    return (
      <g
        key={key}
        transform={`translate(${x * scale + offset}, ${-y * scale + offset})`}
        onClick={() => handlePlayMove(key)}
        className="cursor-pointer group"
      >
        <circle r={hitRadius} fill="transparent" />
        {player && (
          <g transform={`scale(${markerScale}) ${player === 'x' ? `rotate(${xRotation})` : ''}`}>
            {player === 'x' && (
              <g
                stroke={isWinningMove ? "var(--accent-secondary)" : "var(--text-main)"}
                strokeWidth="2.5"
                strokeLinecap="square"
                className="animate-fade-in"
              >
                <line x1="-10" y1="-10" x2="10" y2="10" />
                <line x1="10" y1="-10" x2="-10" y2="10" />
              </g>
            )}
            {player === 'o' && (
              <circle
                r="12"
                fill="none"
                stroke={isWinningMove ? "var(--accent-primary)" : "var(--text-main)"}
                strokeWidth="2.5"
                className="animate-fade-in"
              />
            )}
          </g>
        )}
      </g>
    );
  };

  const getWinPath = () => {
    if (!winningMoves || !winningType) return null;
    const pts = winningMoves.map(key => {
      const [x, y] = COORDINATES[key];
      return { x: x * scale + offset, y: -y * scale + offset };
    });
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  };

  return (
    <div className="flex flex-col items-center h-[100dvh] bg-[var(--bg)] p-6 md:p-10 selection:bg-[var(--accent-primary)] selection:text-[var(--bg)] overflow-hidden">
      {showLobby && (
        <LobbyOverlay
          status={status}
          lobbyCode={lobbyCode}
          onHost={hostLobby}
          onJoin={joinLobby}
          onCancel={() => {
            disconnect();
            resetGame('2p');
          }}
          onExitComplete={() => setShowLobby(false)}
        />
      )}

      {showRules && (
        <RulesOverlay onClose={() => setShowRules(false)} />
      )}

      <header className="w-full max-w-2xl flex items-baseline justify-between shrink-0 mb-6 animate-fade-in">
        <div className="flex items-center gap-4">
          <h1 className="text-4xl md:text-5xl text-[var(--text-main)] flex items-center">
            <span className="relative inline-flex items-center justify-center">
              {/* Back layer - top-right half of the orbit */}
              <svg
                width="64"
                height="64"
                viewBox="0 0 100 100"
                className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 text-[var(--accent-primary)] opacity-90 pointer-events-none z-0"
                style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%)' }}
              >
                <g transform="rotate(45 50 50)">
                  <ellipse
                    cx="50" cy="50" rx="38" ry="8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeOpacity="0.7"
                  />
                  <circle
                    r="6"
                    fill="currentColor"
                  >
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      path="M 12,50 a 38,8 0 1,0 76,0 a 38,10 0 1,0 -76,0"
                    />
                  </circle>
                </g>
              </svg>

              <span className="relative z-10 pointer-events-none">o</span>

              {/* Front layer - bottom-left half of the orbit */}
              <svg
                width="64"
                height="64"
                viewBox="0 0 100 100"
                className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2 text-[var(--accent-primary)] opacity-90 pointer-events-none z-20"
                style={{ clipPath: 'polygon(0 0, 100% 100%, 0 100%)' }}
              >
                <g transform="rotate(45 50 50)">
                  <ellipse
                    cx="50" cy="50" rx="38" ry="8"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeOpacity="0.7"
                  />
                  <circle
                    r="6"
                    fill="currentColor"
                  >
                    <animateMotion
                      dur="3s"
                      repeatCount="indefinite"
                      path="M 12,50 a 38,8 0 1,0 76,0 a 38,10 0 1,0 -76,0"
                    />
                  </circle>
                </g>
              </svg>
            </span>
            rbit
          </h1>
        </div>
        <div className="flex items-center gap-8">
          <div className="flex gap-6 text-xs tracking-widest uppercase font-bold text-[var(--text-dim)]">
            <button
              onClick={() => handleReset('1p')}
              className={`hover:text-[var(--text-main)] transition-colors ${gameMode === '1p' ? 'text-[var(--accent-primary)]' : ''}`}
            >
              SOLO
            </button>
            <button
              onClick={() => handleReset('2p')}
              className={`hover:text-[var(--text-main)] transition-colors ${gameMode === '2p' ? 'text-[var(--accent-primary)]' : ''}`}
            >
              DUO
            </button>
            <button
              onClick={() => {
                if (gameMode !== 'online') {
                  handleReset('online');
                }
              }}
              className={`hover:text-[var(--text-main)] transition-colors ${gameMode === 'online' ? 'text-[var(--accent-primary)]' : ''}`}
            >
              ONLINE
            </button>
          </div>

          <div className="w-[1px] h-4 bg-[var(--border)]"></div>

          <button
            onClick={() => setShowRules(true)}
            className="text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors"
            title="How to play"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></svg>
          </button>

          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="text-[var(--text-dim)] hover:text-[var(--text-main)] transition-colors"
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" /></svg>
            )}
          </button>
        </div>
      </header>

      <div className="flex-1 w-full max-w-2xl flex flex-col min-h-0 items-center justify-center">
        <div className={`grid-transition ${gameMode === '1p' ? 'grid-transition-open mb-8' : ''} shrink-0`}>
          <div className={`opacity-transition ${gameMode === '1p' ? 'opacity-transition-visible' : ''} flex gap-3`}>
            {(['Beginner', 'Pro', 'Impossible'] as const).map((level) => (
              <button
                key={level}
                onClick={() => setDifficulty(level)}
                className={`text-[9px] tracking-[0.2em] uppercase font-black px-3 py-1.5 rounded-full border transition-all ${difficulty === level
                  ? 'bg-[var(--text-main)] text-[var(--bg)] border-[var(--text-main)]'
                  : 'text-[var(--text-dim)] border-[var(--border)] hover:border-[var(--text-muted)]'
                  }`}
              >
                {level}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-6 h-6 flex items-center justify-center shrink-0 animate-fade-in animate-stagger-2">
          {winner ? (
            <span className={`text-sm tracking-[0.3em] uppercase font-black ${winner === 'tie' ? 'text-[var(--text-muted)]' : winner === 'x' ? 'text-[var(--accent-secondary)]' : 'text-[var(--accent-primary)]'}`}>
              {winner === 'tie' ? "Stalemate" : `Player ${winner} Wins`}
            </span>
          ) : isAiThinking ? (
            <span className="text-[var(--accent-primary)] text-[10px] tracking-[0.4em] uppercase font-black animate-pulse">
              Calculating Orbit...
            </span>
          ) : (
            <span className="text-[var(--text-dim)] text-[10px] tracking-[0.4em] uppercase font-black">
              {gameMode === '1p' && turn === 'o' ? 'AI Sequence' : 
               gameMode === 'online' ? (
                 status === 'connected' ? (
                   turn === localPlayer ? 'Your Turn' : "Opponent's Turn"
                 ) : 'Waiting for connection...'
               ) : `Awaiting Player ${turn.toUpperCase()}`}
            </span>
          )}
        </div>

        <div className="relative w-full flex-1 min-h-0 flex items-center justify-center animate-fade-in animate-stagger-2">
          <div className="absolute inset-0 rounded-full bg-[var(--accent-primary)] opacity-[0.03] blur-3xl pointer-events-none"></div>

          <svg
            viewBox="0 0 500 500"
            className="w-full h-full max-w-full max-h-full transition-transform duration-700 relative z-10"
            preserveAspectRatio="xMidYMid meet"
          >
            <circle cx="250" cy="250" r="60" fill="none" stroke="var(--border)" strokeWidth="1" />
            <circle cx="250" cy="250" r="120" fill="none" stroke="var(--border)" strokeWidth="1.5" />
            <circle cx="250" cy="250" r="175" fill="none" stroke="var(--border)" strokeWidth="1.5" />
            <circle cx="250" cy="250" r="230" fill="none" stroke="var(--border)" strokeWidth="2" />

            <g stroke="var(--border)" strokeWidth="1">
              {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
                <line
                  key={angle}
                  x1="250" y1="250"
                  x2={250 + 230 * Math.cos(angle * Math.PI / 180)}
                  y2={250 + 230 * Math.sin(angle * Math.PI / 180)}
                />
              ))}
            </g>

            {winningMoves && (
              <path
                d={getWinPath() || ''}
                fill="none"
                stroke="var(--text-main)"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="animate-[dash_2s_linear_infinite]"
              />
            )}

            {(Object.keys(COORDINATES) as LocationKey[]).map(renderCell)}
          </svg>
        </div>

        <button
          onClick={() => handleReset()}
          disabled={gameMode === 'online' && !winner}
          className="mt-6 md:mt-10 group flex flex-col items-center gap-2 shrink-0 animate-fade-in animate-stagger-3 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="text-[var(--text-dim)] text-[10px] tracking-[0.3em] uppercase font-bold group-hover:text-[var(--text-main)] transition-colors">
            {gameMode === 'online' ? 'Rematch' : 'Reset System'}
          </span>
          <div className="w-8 h-[1px] bg-[var(--border)] group-hover:w-16 group-hover:bg-[var(--text-main)] transition-all duration-500"></div>
        </button>
      </div>

      <footer className="mt-4 md:mt-8 shrink-0 animate-fade-in animate-stagger-3">
      </footer>

      <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -20; }
        }
      `}</style>
    </div>
  );
};

export default CircularBoard;
