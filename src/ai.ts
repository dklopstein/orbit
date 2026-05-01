import { WIN_CONDITIONS, COORDINATES } from './constants';
import type { LocationKey, Player, BoardState } from './constants';

const AI_PLAYER: Player = 'o';
const HUMAN_PLAYER: Player = 'x';

export const evaluateBoard = (board: BoardState): number => {
  let score = 0;

  for (const moves of Object.values(WIN_CONDITIONS)) {
    let aiCount = 0;
    let humanCount = 0;

    for (const move of moves) {
      const player = board[move as LocationKey];
      if (player === AI_PLAYER) aiCount++;
      else if (player === HUMAN_PLAYER) humanCount++;
    }

    if (aiCount === 4) return 1000000;
    if (humanCount === 4) return -1000000;

    if (aiCount > 0 && humanCount === 0) {
      if (aiCount === 3) score += 5000;
      if (aiCount === 2) score += 500;
      if (aiCount === 1) score += 50;
    } else if (humanCount > 0 && aiCount === 0) {
      if (humanCount === 3) score -= 8000; // Penalize human 3-in-a-row more to force blocks
      if (humanCount === 2) score -= 800;
      if (humanCount === 1) score -= 80;
    }
  }

  return score;
};

const minimax = (
  board: BoardState,
  depth: number,
  alpha: number,
  beta: number,
  isMaximizing: boolean
): number => {
  const score = evaluateBoard(board);
  if (Math.abs(score) >= 1000000 || depth === 0) return score;

  const availableMoves = (Object.keys(COORDINATES) as LocationKey[]).filter(
    (key) => !board[key]
  );

  if (availableMoves.length === 0) return 0;

  if (isMaximizing) {
    let maxEval = -Infinity;
    for (const move of availableMoves) {
      board[move] = AI_PLAYER;
      const ev = minimax(board, depth - 1, alpha, beta, false);
      delete board[move];
      maxEval = Math.max(maxEval, ev);
      alpha = Math.max(alpha, ev);
      if (beta <= alpha) break;
    }
    return maxEval;
  } else {
    let minEval = Infinity;
    for (const move of availableMoves) {
      board[move] = HUMAN_PLAYER;
      const ev = minimax(board, depth - 1, alpha, beta, true);
      delete board[move];
      minEval = Math.min(minEval, ev);
      beta = Math.min(beta, ev);
      if (beta <= alpha) break;
    }
    return minEval;
  }
};

export const getBestMove = (board: BoardState, depth: number = 3): LocationKey | null => {
  const availableMoves = (Object.keys(COORDINATES) as LocationKey[]).filter(
    (key) => !board[key]
  );

  if (availableMoves.length === 0) return null;

  let bestScore = -Infinity;
  let bestMove: LocationKey | null = null;

  // Shuffle available moves to add some variety to AI play
  const shuffledMoves = availableMoves.sort(() => Math.random() - 0.5);

  for (const move of shuffledMoves) {
    board[move] = AI_PLAYER;
    const score = minimax(board, depth - 1, -Infinity, Infinity, false);
    delete board[move];

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  return bestMove;
};
