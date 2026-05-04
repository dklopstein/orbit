import React, { useState } from 'react';
import { COORDINATES } from './constants';
import type { LocationKey } from './constants';

interface RulesOverlayProps {
  onClose: () => void;
}

const RINGS_BASE = [60, 120, 175, 230];

const MiniBoard: React.FC<{ winningMoves: string[], title: string, description: string, onClick: () => void }> = ({ winningMoves, title, description, onClick }) => {
  const scale = 0.4;
  const offset = 100;

  const renderCell = (key: string) => {
    const [x, y] = COORDINATES[key as LocationKey];
    const isWinningMove = winningMoves.includes(key);
    
    const ring = parseInt(key.slice(1, 2));
    const sliceNum = parseInt(key.slice(3));
    const scales = [0, 0.5, 0.8, 1.05, 1.25];
    const markerScale = scales[ring] * scale;
    const xRotation = (sliceNum * 45) + 22.5;

    if (!isWinningMove) return null;

    return (
      <g
        key={key}
        transform={`translate(${x * scale + offset}, ${-y * scale + offset})`}
      >
        <g transform={`scale(${markerScale}) ${xRotation ? `rotate(${xRotation})` : ''}`}>
           <g
            stroke="var(--accent-secondary)"
            strokeWidth="3"
            strokeLinecap="square"
          >
            <line x1="-10" y1="-10" x2="10" y2="10" />
            <line x1="10" y1="-10" x2="-10" y2="10" />
          </g>
        </g>
      </g>
    );
  };

  const getWinPath = () => {
    const pts = winningMoves.map(key => {
      const [x, y] = COORDINATES[key as LocationKey];
      return { x: x * scale + offset, y: -y * scale + offset };
    });
    return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
  };

  return (
    <div 
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 border border-[var(--border)] rounded-xl bg-[var(--bg)] hover:border-[var(--text-muted)] transition-colors cursor-pointer group/card"
    >
      <svg viewBox="0 0 200 200" className="w-32 h-32 group-hover/card:scale-105 transition-transform duration-500">
        {RINGS_BASE.map((r, i) => (
          <circle key={i} cx="100" cy="100" r={r * scale} fill="none" stroke="var(--border)" strokeWidth="0.5" />
        ))}
        
        <g stroke="var(--border)" strokeWidth="0.8">
          {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
            <line
              key={angle}
              x1="100" y1="100"
              x2={100 + RINGS_BASE[3] * scale * Math.cos(angle * Math.PI / 180)}
              y2={100 + RINGS_BASE[3] * scale * Math.sin(angle * Math.PI / 180)}
            />
          ))}
        </g>

        <path
          d={getWinPath()}
          fill="none"
          stroke="var(--text-main)"
          strokeWidth="1"
          strokeDasharray="2 2"
        />
        {winningMoves.map(renderCell)}
      </svg>
      <div className="text-center">
        <h4 className="text-[10px] tracking-[0.2em] uppercase font-black text-[var(--text-main)]">{title}</h4>
        <p className="text-[9px] text-[var(--text-dim)] tracking-wider mt-1">{description}</p>
      </div>
    </div>
  );
};

const RulesOverlay: React.FC<RulesOverlayProps> = ({ onClose }) => {
  const [isExiting, setIsExiting] = useState(false);
  const [expandedWin, setExpandedWin] = useState<{ moves: string[], title: string } | null>(null);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      onClose();
    }, 500);
  };

  const renderEnlargedBoard = () => {
    if (!expandedWin) return null;
    const scale = 0.8;
    const offset = 250;

    const renderLargeCell = (key: string) => {
      const [x, y] = COORDINATES[key as LocationKey];
      const isWinningMove = expandedWin.moves.includes(key);
      
      const ring = parseInt(key.slice(1, 2));
      const sliceNum = parseInt(key.slice(3));
      const scales = [0, 0.5, 0.8, 1.05, 1.25];
      const markerScale = scales[ring] * scale;
      const xRotation = (sliceNum * 45) + 22.5;

      if (!isWinningMove) return null;

      return (
        <g
          key={key}
          transform={`translate(${x * scale + offset}, ${-y * scale + offset})`}
        >
          <g transform={`scale(${markerScale}) ${xRotation ? `rotate(${xRotation})` : ''}`}>
             <g
              stroke="var(--accent-secondary)"
              strokeWidth="2.5"
              strokeLinecap="square"
            >
              <line x1="-10" y1="-10" x2="10" y2="10" />
              <line x1="10" y1="-10" x2="-10" y2="10" />
            </g>
          </g>
        </g>
      );
    };

    const getLargeWinPath = () => {
      const pts = expandedWin.moves.map(key => {
        const [x, y] = COORDINATES[key as LocationKey];
        return { x: x * scale + offset, y: -y * scale + offset };
      });
      return pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x},${p.y}`).join(' ');
    };

    return (
      <div 
        className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-[var(--bg)] bg-opacity-90 backdrop-blur-md animate-fade-in p-8"
        onClick={() => setExpandedWin(null)}
      >
        <div className="flex flex-col items-center gap-4 mb-4">
          <h2 className="text-2xl tracking-[0.2em] uppercase font-black text-[var(--text-main)] animate-fade-in text-center">
            {expandedWin.title}
          </h2>
          <div className="w-16 h-[1px] bg-[var(--accent-primary)]"></div>
        </div>

        <svg viewBox="0 0 500 500" className="w-full h-full max-w-xl max-h-[50vh] animate-scale-in">
          {RINGS_BASE.map((r, i) => (
            <circle key={i} cx="250" cy="250" r={r * scale} fill="none" stroke="var(--border)" strokeWidth={1 + i * 0.2} />
          ))}
          
          <g stroke="var(--border)" strokeWidth="1">
            {[0, 45, 90, 135, 180, 225, 270, 315].map(angle => (
              <line
                key={angle}
                x1="250" y1="250"
                x2={250 + RINGS_BASE[3] * scale * Math.cos(angle * Math.PI / 180)}
                y2={250 + RINGS_BASE[3] * scale * Math.sin(angle * Math.PI / 180)}
              />
            ))}
          </g>

          <path
            d={getLargeWinPath()}
            fill="none"
            stroke="var(--text-main)"
            strokeWidth="2"
            strokeDasharray="8 8"
            className="animate-[dash_2s_linear_infinite]"
          />
          {expandedWin.moves.map(renderLargeCell)}
        </svg>

        <span className="mt-8 text-[var(--text-dim)] text-[10px] tracking-[0.4em] uppercase font-bold animate-pulse text-center">
          Click anywhere to minimize
        </span>
        <style>{`
          @keyframes dash {
            to { stroke-dashoffset: -32; }
          }
        `}</style>
      </div>
    );
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)] bg-opacity-95 backdrop-blur-sm p-4 ${isExiting ? 'animate-fade-out' : 'animate-fade-in'}`}>
      <div className="w-full max-w-2xl flex flex-col items-center gap-8 overflow-y-auto max-h-full py-8">
        <div className="flex flex-col items-center gap-2">
          <h2 className="text-2xl tracking-[0.2em] uppercase font-black text-[var(--text-main)]">
            Flight Manual
          </h2>
          <div className="w-12 h-[1px] bg-[var(--accent-primary)]"></div>
        </div>

        <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-8 text-[var(--text-main)]">
          <div className="flex flex-col gap-4">
            <h3 className="text-xs tracking-[0.3em] uppercase font-bold text-[var(--accent-primary)]">Objectives</h3>
            <p className="text-sm leading-relaxed text-[var(--text-dim)]">
              Navigate the orbital grid and align <span className="text-[var(--text-main)] font-bold">four</span> of your markers in a sequence. 
              The circular board offers unique pathways that conventional grids lack.
            </p>
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[var(--accent-secondary)]"></div>
                <span className="text-[10px] tracking-widest uppercase font-bold">Player X (Interceptor)</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full border border-[var(--accent-primary)]"></div>
                <span className="text-[10px] tracking-widest uppercase font-bold">Player O (Orbiter)</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <h3 className="text-xs tracking-[0.3em] uppercase font-bold text-[var(--accent-secondary)]">Win Conditions</h3>
            <div className="grid grid-cols-2 gap-4">
              <MiniBoard 
                title="Radial" 
                description="4 aligned center to edge" 
                winningMoves={['r1s1', 'r2s1', 'r3s1', 'r4s1']} 
                onClick={() => setExpandedWin({ moves: ['r1s1', 'r2s1', 'r3s1', 'r4s1'], title: 'Radial' })}
              />
              <MiniBoard 
                title="Circular" 
                description="4 along the same orbit" 
                winningMoves={['r3s0', 'r3s1', 'r3s2', 'r3s3']} 
                onClick={() => setExpandedWin({ moves: ['r3s0', 'r3s1', 'r3s2', 'r3s3'], title: 'Circular' })}
              />
              <MiniBoard 
                title="Spiral CW" 
                description="Moving out clockwise" 
                winningMoves={['r1s0', 'r2s1', 'r3s2', 'r4s3']} 
                onClick={() => setExpandedWin({ moves: ['r1s0', 'r2s1', 'r3s2', 'r4s3'], title: 'Spiral CW' })}
              />
              <MiniBoard 
                title="Spiral CCW" 
                description="Moving out counter-clockwise" 
                winningMoves={['r1s0', 'r2s7', 'r3s6', 'r4s5']} 
                onClick={() => setExpandedWin({ moves: ['r1s0', 'r2s7', 'r3s6', 'r4s5'], title: 'Spiral CCW' })}
              />
            </div>
          </div>
        </div>

        <button
          onClick={handleClose}
          className="group flex flex-col items-center gap-2 mt-4"
        >
          <span className="text-[var(--text-dim)] text-[10px] tracking-[0.3em] uppercase font-bold group-hover:text-[var(--text-main)] transition-colors">
            Dismiss Briefing
          </span>
          <div className="w-4 h-[1px] bg-[var(--border)] group-hover:w-12 group-hover:bg-[var(--text-main)] transition-all duration-500"></div>
        </button>
      </div>
      {renderEnlargedBoard()}
    </div>
  );
};

export default RulesOverlay;
