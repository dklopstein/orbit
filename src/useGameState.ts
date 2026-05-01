import { useState, useCallback, useEffect, useRef } from 'react';
import { WIN_CONDITIONS, COORDINATES } from './constants';
import type { LocationKey, Player, BoardState } from './constants';
import { getBestMove } from './ai';

export type GameMode = '1p' | '2p';

export const useGameState = () => {
  const [board, setBoard] = useState<BoardState>({});
  const [turn, setTurn] = useState<Player>('x');
  const [winner, setWinner] = useState<Player | 'tie' | null>(null);
  const [winningMoves, setWinningMoves] = useState<readonly LocationKey[] | null>(null);
  const [winningType, setWinningType] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('2p');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const isAiThinkingRef = useRef(false);

  const checkWinner = useCallback((currentBoard: BoardState) => {
    for (const [condition, moves] of Object.entries(WIN_CONDITIONS)) {
      const p1 = currentBoard[moves[0] as LocationKey];
      if (p1 && moves.every(move => currentBoard[move as LocationKey] === p1)) {
        return { winner: p1, moves: moves as readonly LocationKey[], type: condition };
      }
    }

    const isTie = Object.keys(COORDINATES).every(key => currentBoard[key as LocationKey]);
    if (isTie) return { winner: 'tie' as const, moves: null };

    return null;
  }, []);

  const playMove = useCallback((location: LocationKey, isAiCall: boolean = false) => {
    console.log('[playMove] Called for:', location, 'isAiCall:', isAiCall);
    if (board[location] || winner || (isAiThinkingRef.current && !isAiCall)) {
      console.log('[playMove] Blocked:', { 
        occupied: !!board[location], 
        hasWinner: !!winner, 
        aiThinking: isAiThinkingRef.current, 
        isAiCall 
      });
      return;
    }

    const newBoard = { ...board, [location]: turn };
    setBoard(newBoard);

    const winResult = checkWinner(newBoard);
    if (winResult) {
      setWinner(winResult.winner);
      setWinningMoves(winResult.moves);
      setWinningType(winResult.type || null);
    } else {
      setTurn(prev => (prev === 'x' ? 'o' : 'x'));
    }
  }, [board, turn, winner, checkWinner]);

  // AI Turn effect
  useEffect(() => {
    console.log('[AI Effect] Checking conditions:', { gameMode, turn, hasWinner: !!winner, isAiThinking: isAiThinkingRef.current });
    
    if (gameMode === '1p' && turn === 'o' && !winner && !isAiThinkingRef.current) {
      console.log('[AI Effect] Conditions met, starting AI timer...');
      isAiThinkingRef.current = true;
      setIsAiThinking(true);
      
      const timer = setTimeout(() => {
        console.log('[AI Effect] Timer fired, calling getBestMove...');
        const currentBoard = { ...board };
        const bestMove = getBestMove(currentBoard, 4);
        
        console.log('[AI Effect] getBestMove result:', bestMove);
        
        if (bestMove) {
          playMove(bestMove, true);
        }
        
        isAiThinkingRef.current = false;
        setIsAiThinking(false);
      }, 400);
      return () => {
        console.log('[AI Effect] Cleanup: clearing timer');
        clearTimeout(timer);
      };
    }
  }, [gameMode, turn, winner, board, playMove]);

  const resetGame = useCallback((mode?: GameMode) => {
    setBoard({});
    setTurn('x');
    setWinner(null);
    setWinningMoves(null);
    setWinningType(null);
    isAiThinkingRef.current = false;
    setIsAiThinking(false);
    if (mode) setGameMode(mode);
  }, []);

  return {
    board,
    turn,
    winner,
    winningMoves,
    winningType,
    gameMode,
    isAiThinking,
    playMove,
    resetGame,
    setGameMode,
  };
};
