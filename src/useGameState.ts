import { useState, useCallback, useEffect, useRef } from 'react';
import { WIN_CONDITIONS, COORDINATES } from './constants';
import type { LocationKey, Player, BoardState, Difficulty } from './constants';
import { getBestMove } from './ai';

export type GameMode = '1p' | '2p' | 'online';

export const useGameState = () => {
  const [board, setBoard] = useState<BoardState>({});
  const [turn, setTurn] = useState<Player>('x');
  const [winner, setWinner] = useState<Player | 'tie' | null>(null);
  const [winningMoves, setWinningMoves] = useState<readonly LocationKey[] | null>(null);
  const [winningType, setWinningType] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<GameMode>('2p');
  const [difficulty, setDifficulty] = useState<Difficulty>('Impossible');
  const [localPlayer, setLocalPlayer] = useState<Player | null>(null);
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

  const playMove = useCallback((location: LocationKey, isRemote: boolean = false) => {
    // In online mode, only allow moves if it's our turn OR if it's a remote move being applied
    if (gameMode === 'online' && !isRemote && turn !== localPlayer) {
      return;
    }

    if (board[location] || winner || (isAiThinkingRef.current && !isRemote)) {
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

    return { location, player: turn };
  }, [board, turn, winner, checkWinner, gameMode, localPlayer]);

  // AI Turn effect
  useEffect(() => {
    if (gameMode === '1p' && turn === 'o' && !winner && !isAiThinkingRef.current) {
      isAiThinkingRef.current = true;
      setIsAiThinking(true);
      
      const timer = setTimeout(() => {
        const currentBoard = { ...board };
        const bestMove = getBestMove(currentBoard, difficulty);
        
        if (bestMove) {
          playMove(bestMove, true);
        }
        
        isAiThinkingRef.current = false;
        setIsAiThinking(false);
      }, 400);
      return () => {
        clearTimeout(timer);
      };
    }
  }, [gameMode, turn, winner, board, playMove, difficulty]);

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
    difficulty,
    localPlayer,
    isAiThinking,
    playMove,
    resetGame,
    setGameMode,
    setLocalPlayer,
    setDifficulty,
  };
};
