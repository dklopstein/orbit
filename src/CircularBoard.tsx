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
        <circle r="25" fill="transparent" className="group-hover:fill-gray-100/20" />
        
        {/* Placeholder circle for the cell */}
        <circle r="20" fill="none" stroke="#ddd" strokeWidth="1" />

        {player === 'x' && (
          <g stroke={isWinningMove ? "red" : "black"} strokeWidth="4" strokeLinecap="round">
            <line x1="-10" y1="-10" x2="10" y2="10" />
            <line x1="10" y1="-10" x2="-10" y2="10" />
          </g>
        )}
        {player === 'o' && (
          <circle 
            r="12" 
            fill="none" 
            stroke={isWinningMove ? "blue" : "black"} 
            strokeWidth="4" 
          />
        )}
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800">Circle Tic-Tac-Toe</h1>
      
      <div className="mb-4 text-xl font-semibold">
        {winner ? (
          winner === 'tie' ? (
            <span className="text-orange-600">It's a Tie!</span>
          ) : (
            <span className={winner === 'x' ? 'text-red-600' : 'text-blue-600'}>
              Player {winner.toUpperCase()} Wins!
            </span>
          )
        ) : (
          <span>Player {turn.toUpperCase()}'s Turn</span>
        )}
      </div>

      <div className="relative bg-white rounded-full shadow-2xl p-4">
        <svg width="500" height="500" viewBox="0 0 500 500">
          {/* Static Board Lines (simplified) */}
          <circle cx="250" cy="250" r="60" fill="none" stroke="#eee" strokeWidth="2" />
          <circle cx="250" cy="250" r="120" fill="none" stroke="#eee" strokeWidth="2" />
          <circle cx="250" cy="250" r="170" fill="none" stroke="#eee" strokeWidth="2" />
          <circle cx="250" cy="250" r="220" fill="none" stroke="#eee" strokeWidth="2" />
          
          {/* Radial Lines */}
          <line x1="250" y1="30" x2="250" y2="470" stroke="#eee" strokeWidth="2" />
          <line x1="50" y1="150" x2="450" y2="350" stroke="#eee" strokeWidth="2" />
          <line x1="50" y1="350" x2="450" y2="150" stroke="#eee" strokeWidth="2" />

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
              stroke="rgba(0,0,0,0.2)"
              strokeWidth="8"
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
        className="mt-8 px-8 py-3 bg-indigo-600 text-white rounded-full font-bold shadow-lg hover:bg-indigo-700 transition-colors"
      >
        Restart Game
      </button>
    </div>
  );
};

export default CircularBoard;
