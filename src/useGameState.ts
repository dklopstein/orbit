import { useState, useCallback } from 'react';
import { WIN_CONDITIONS, COORDINATES } from './constants';
import type { LocationKey, Player, BoardState } from './constants';

export const useGameState = () => {
  const [board, setBoard] = useState<BoardState>({});
  const [turn, setTurn] = useState<Player>('x');
  const [winner, setWinner] = useState<Player | 'tie' | null>(null);
  const [winningMoves, setWinningMoves] = useState<readonly LocationKey[] | null>(null);

  const [winningType, setWinningType] = useState<string | null>(null);

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

  const playMove = useCallback((location: LocationKey) => {
    if (board[location] || winner) return;

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

  const resetGame = useCallback(() => {
    setBoard({});
    setTurn('x');
    setWinner(null);
    setWinningMoves(null);
    setWinningType(null);
  }, []);

  return {
    board,
    turn,
    winner,
    winningMoves,
    winningType,
    playMove,
    resetGame,
  };
};
