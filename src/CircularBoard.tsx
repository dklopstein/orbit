import React from 'react';
import { COORDINATES } from './constants';
import type { LocationKey } from './constants';
import { useGameState } from './useGameState';

const CircularBoard: React.FC = () => {
  const { board, turn, winner, winningMoves, winningType, playMove, resetGame } = useGameState();

  const scale = 1;
  const offset = 250;

  const renderCell = (key: LocationKey) => {
    const [x, y] = COORDINATES[key];
    const player = board[key];
    const isWinningMove = winningMoves?.includes(key);
    
    const ring = parseInt(key.slice(1, 2));
    const scales = [0, 0.5, 0.8, 1.05, 1.25]; // index 1-4
    const hitRadii = [0, 20, 28, 34, 38];
    const markerScale = scales[ring];
    const hitRadius = hitRadii[ring];

    return (
      <g 
        key={key} 
        transform={`translate(${x * scale + offset}, ${-y * scale + offset})`}
        onClick={() => playMove(key)}
        className="cursor-pointer group"
      >
        <circle r={hitRadius} fill="transparent" className="group-hover:fill-gray-100/20" />
        
        {player && (
          <g transform={`scale(${markerScale})`}>
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

      <div className="relative shadow-2xl rounded-full overflow-hidden leading-[0]">
        <svg width="460" height="460" viewBox="20 20 460 460" className="bg-white">
          {/* Concentric Rings */}
          <circle cx="250" cy="250" r="60" fill="none" stroke="#f3f4f6" strokeWidth="3" />
          <circle cx="250" cy="250" r="120" fill="none" stroke="#f3f4f6" strokeWidth="3" />
          <circle cx="250" cy="250" r="175" fill="none" stroke="#f3f4f6" strokeWidth="3" />
          <circle cx="250" cy="250" r="230" fill="none" stroke="#f3f4f6" strokeWidth="3" />
          
          <g stroke="#f3f4f6" strokeWidth="3">
            <line x1="250" y1="20" x2="250" y2="480" />
            <line x1="20" y1="250" x2="480" y2="250" />
            <line x1="87" y1="87" x2="413" y2="413" />
            <line x1="87" y1="413" x2="413" y2="87" />
          </g>

          {winningMoves && (
            <path
              d={getWinPath() || ''}
              fill="none"
              stroke="rgba(0,0,0,0.15)"
              strokeWidth="14"
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          )}

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
