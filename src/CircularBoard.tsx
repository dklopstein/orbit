import React from 'react';
import { COORDINATES } from './constants';
import type { LocationKey } from './constants';
import { useGameState } from './useGameState';

const CircularBoard: React.FC = () => {
  const { 
    board, 
    turn, 
    winner, 
    winningMoves, 
    winningType, 
    gameMode, 
    difficulty,
    isAiThinking, 
    playMove, 
    resetGame,
    setDifficulty,
  } = useGameState();

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
        onClick={() => playMove(key)}
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
      <header className="w-full max-w-2xl flex items-baseline justify-between shrink-0 mb-6 animate-fade-in">
        <h1 className="text-4xl md:text-5xl text-[var(--text-main)]">
          orbit
        </h1>
        <div className="flex gap-6 text-xs tracking-widest uppercase font-bold text-[var(--text-dim)]">
          <button 
            onClick={() => resetGame('1p')}
            className={`hover:text-[var(--text-main)] transition-colors ${gameMode === '1p' ? 'text-[var(--accent-primary)]' : ''}`}
          >
            SOLO
          </button>
          <button 
            onClick={() => resetGame('2p')}
            className={`hover:text-[var(--text-main)] transition-colors ${gameMode === '2p' ? 'text-[var(--accent-primary)]' : ''}`}
          >
            DUO
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
                className={`text-[9px] tracking-[0.2em] uppercase font-black px-3 py-1.5 rounded-full border transition-all ${
                  difficulty === level 
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
              {gameMode === '1p' && turn === 'o' ? 'AI Sequence' : `Awaiting Player ${turn.toUpperCase()}`}
            </span>
          )}
        </div>

        <div className="relative w-full flex-1 min-h-0 flex items-center justify-center animate-fade-in animate-stagger-2">
          <div className="absolute inset-0 rounded-full bg-[oklch(75%_0.12_260_/_0.03)] blur-3xl pointer-events-none"></div>
          
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
          onClick={() => resetGame()}
          className="mt-6 md:mt-10 group flex flex-col items-center gap-2 shrink-0 animate-fade-in animate-stagger-3"
        >
          <span className="text-[var(--text-dim)] text-[10px] tracking-[0.3em] uppercase font-bold group-hover:text-[var(--text-main)] transition-colors">
            Reset System
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
