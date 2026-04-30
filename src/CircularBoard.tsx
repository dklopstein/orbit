import React from 'react';
import { COORDINATES } from './constants';
import type { LocationKey } from './constants';
import { useGameState } from './useGameState';

const CircularBoard: React.FC = () => {
  const { board, turn, winner, winningMoves, playMove, resetGame } = useGameState();

  // Scale coordinates to fit in a 500x500 SVG (original coordinates are roughly -220 to 220)
  const scale = 1;
  const offset = 250;

  const renderCell = (key: LocationKey) => {
    const [x, y] = COORDINATES[key];
    const player = board[key];
    const isWinningMove = winningMoves?.includes(key);

    return (
      <g 
        key={key} 
        transform={`translate(${x * scale + offset}, ${-y * scale + offset})`}
        onClick={() => playMove(key)}
        className="cursor-pointer group"
      >
        {/* Hit area */}
        <circle r="28" fill="transparent" className="group-hover:fill-gray-100/20" />
        
        {player === 'x' && (
          <g stroke={isWinningMove ? "#ef4444" : "#374151"} strokeWidth="5" strokeLinecap="round">
            <line x1="-12" y1="-12" x2="12" y2="12" />
            <line x1="12" y1="-12" x2="-12" y2="12" />
          </g>
        )}
        {player === 'o' && (
          <circle 
            r="14" 
            fill="none" 
            stroke={isWinningMove ? "#3b82f6" : "#374151"} 
            strokeWidth="5" 
          />
        )}
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 tracking-tight">Circle Tic-Tac-Toe</h1>
      
      <div className="mb-6 text-2xl font-bold h-8">
        {winner ? (
          winner === 'tie' ? (
            <span className="text-orange-600">It's a Tie!</span>
          ) : (
            <span className={winner === 'x' ? 'text-red-600' : 'text-blue-600'}>
              Player {winner.toUpperCase()} Wins!
            </span>
          )
        ) : (
          <span className="text-gray-600">Player {turn.toUpperCase()}'s Turn</span>
        )}
      </div>

      <div className="relative bg-white rounded-full shadow-2xl p-6 border-4 border-gray-100">
        <svg width="500" height="500" viewBox="0 0 500 500">
          {/* Concentric Rings */}
          <circle cx="250" cy="250" r="60" fill="none" stroke="#f3f4f6" strokeWidth="3" />
          <circle cx="250" cy="250" r="120" fill="none" stroke="#f3f4f6" strokeWidth="3" />
          <circle cx="250" cy="250" r="175" fill="none" stroke="#f3f4f6" strokeWidth="3" />
          <circle cx="250" cy="250" r="230" fill="none" stroke="#f3f4f6" strokeWidth="3" />
          
          {/* 8 Slices (4 Lines) */}
          <g stroke="#f3f4f6" strokeWidth="3">
            <line x1="250" y1="20" x2="250" y2="480" /> {/* N-S */}
            <line x1="20" y1="250" x2="480" y2="250" /> {/* E-W */}
            <line x1="87" y1="87" x2="413" y2="413" />   {/* NW-SE */}
            <line x1="87" y1="413" x2="413" y2="87" />   {/* SW-NE */}
          </g>

          {/* Winning Line */}
          {winningMoves && (
            <polyline
              points={winningMoves
                .map(key => {
                  const [x, y] = COORDINATES[key];
                  return `${x * scale + offset},${-y * scale + offset}`;
                })
                .join(' ')}
              fill="none"
              stroke="rgba(0,0,0,0.1)"
              strokeWidth="12"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

          {/* Interactive Cells */}
          {(Object.keys(COORDINATES) as LocationKey[]).map(renderCell)}
        </svg>
      </div>

      <button
        onClick={resetGame}
        className="mt-10 px-10 py-4 bg-gray-900 text-white rounded-2xl font-bold shadow-xl hover:bg-gray-800 transition-all transform hover:scale-105 active:scale-95"
      >
        Restart Game
      </button>
    </div>
  );
};

export default CircularBoard;
