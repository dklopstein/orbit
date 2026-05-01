import { WIN_CONDITIONS, COORDINATES } from './constants';
import type { LocationKey, Player, BoardState } from './constants';

const AI_PLAYER: Player = 'o';
const HUMAN_PLAYER: Player = 'x';

const ALL_MOVES = Object.keys(COORDINATES) as LocationKey[];
const WIN_CONDITION_LIST = Object.values(WIN_CONDITIONS) as LocationKey[][];

export const evaluateBoard = (board: BoardState): number => {
  let score = 0;

  for (let i = 0; i < WIN_CONDITION_LIST.length; i++) {
    const moves = WIN_CONDITION_LIST[i];
    let aiCount = 0;
    let humanCount = 0;

    for (let j = 0; j < moves.length; j++) {
      const player = board[moves[j]];
      if (player === AI_PLAYER) aiCount++;
      else if (player === HUMAN_PLAYER) humanCount++;
    }

    if (aiCount === 4) return 1000000;
    if (humanCount === 4) return -1000000;

    if (aiCount > 0 && humanCount === 0) {
      if (aiCount === 3) score += 5000;
      else if (aiCount === 2) score += 500;
      else score += 50;
    } else if (humanCount > 0 && aiCount === 0) {
      if (humanCount === 3) score -= 8000;
      else if (humanCount === 2) score -= 800;
      else score -= 80;
    }
  }

  return score;
};

const orderMoves = (board: BoardState, moves: LocationKey[], player: Player): LocationKey[] => {
  return moves
    .map((move) => {
      board[move] = player;
      const score = Math.abs(evaluateBoard(board));
      delete board[move];
      return { move, score };
    })
    .sort((a, b) => b.score - a.score)
    .map((item) => item.move);
};

export const getBestMove = (board: BoardState, depth: number = 3): LocationKey | null => {
  console.log('getting best move')
  const startTime = performance.now();
  let evaluations = 0;

  const minimax = (
    board: BoardState,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): number => {
    evaluations++;
    const score = evaluateBoard(board);
    if (Math.abs(score) >= 1000000 || depth === 0) return score;

    const availableMoves: LocationKey[] = [];
    for (let i = 0; i < ALL_MOVES.length; i++) {
      if (!board[ALL_MOVES[i]]) availableMoves.push(ALL_MOVES[i]);
    }

    if (availableMoves.length === 0) return 0;

    // Order moves to improve pruning
    const orderedMoves = orderMoves(board, availableMoves, isMaximizing ? AI_PLAYER : HUMAN_PLAYER);

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (let i = 0; i < orderedMoves.length; i++) {
        const move = orderedMoves[i];
        board[move] = AI_PLAYER;
        const ev = minimax(board, depth - 1, alpha, beta, false);
        delete board[move];

        if (ev > maxEval) maxEval = ev;
        if (ev > alpha) alpha = ev;
        if (beta <= alpha) break;
      }
      return maxEval === -Infinity ? 0 : maxEval;
    } else {
      let minEval = Infinity;
      for (let i = 0; i < orderedMoves.length; i++) {
        const move = orderedMoves[i];
        board[move] = HUMAN_PLAYER;
        const ev = minimax(board, depth - 1, alpha, beta, true);
        delete board[move];

        if (ev < minEval) minEval = ev;
        if (ev < beta) beta = ev;
        if (beta <= alpha) break;
      }
      return minEval === Infinity ? 0 : minEval;
    }
  };

  const availableMoves: LocationKey[] = [];
  for (let i = 0; i < ALL_MOVES.length; i++) {
    if (!board[ALL_MOVES[i]]) availableMoves.push(ALL_MOVES[i]);
  }

  if (availableMoves.length === 0) return null;

  let bestScore = -Infinity;
  let bestMove: LocationKey | null = null;

  // Order moves for the root search
  const orderedMoves = orderMoves(board, availableMoves, AI_PLAYER);

  for (let i = 0; i < orderedMoves.length; i++) {
    const move = orderedMoves[i];
    board[move] = AI_PLAYER;
    const score = minimax(board, depth - 1, -Infinity, Infinity, false);
    delete board[move];

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  const endTime = performance.now();
  console.log(`[AI] Move: ${bestMove}, Evaluations: ${evaluations}, Time: ${(endTime - startTime).toFixed(2)}ms`);

  return bestMove;
};
