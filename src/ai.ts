import { WIN_CONDITIONS, COORDINATES } from './constants';
import type { LocationKey, Player, BoardState } from './constants';

const AI_PLAYER: Player = 'o';
const HUMAN_PLAYER: Player = 'x';

const ALL_MOVES = Object.keys(COORDINATES) as LocationKey[];
const WIN_CONDITION_LIST = Object.values(WIN_CONDITIONS) as LocationKey[][];

// Heuristic scores for evaluateBoard
const SCORE_WIN = 1000000;
const SCORE_THREE = 10000;
const SCORE_TWO = 500;
const SCORE_ONE = 50;

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

    if (aiCount === 4) return SCORE_WIN;
    if (humanCount === 4) return -SCORE_WIN;

    if (aiCount > 0 && humanCount === 0) {
      if (aiCount === 3) score += SCORE_THREE;
      else if (aiCount === 2) score += SCORE_TWO;
      else score += SCORE_ONE;
    } else if (humanCount > 0 && aiCount === 0) {
      if (humanCount === 3) score -= SCORE_THREE * 1.5; // Prioritize blocking human 3-in-a-row
      else if (humanCount === 2) score -= SCORE_TWO;
      else score -= SCORE_ONE;
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

export const getBestMove = (board: BoardState, depth: number = 4): LocationKey | null => {
  const startTime = performance.now();
  let evaluations = 0;

  const availableMoves: LocationKey[] = [];
  for (let i = 0; i < ALL_MOVES.length; i++) {
    if (!board[ALL_MOVES[i]]) availableMoves.push(ALL_MOVES[i]);
  }

  if (availableMoves.length === 0) return null;

  // --- IMMEDIATE WIN/BLOCK DETECTION ---
  // Check for immediate win
  for (const move of availableMoves) {
    board[move] = AI_PLAYER;
    const score = evaluateBoard(board);
    delete board[move];
    if (score === SCORE_WIN) return move;
  }

  // Check for immediate block
  for (const move of availableMoves) {
    board[move] = HUMAN_PLAYER;
    const score = evaluateBoard(board);
    delete board[move];
    if (score === -SCORE_WIN) return move;
  }

  const minimax = (
    board: BoardState,
    depth: number,
    alpha: number,
    beta: number,
    isMaximizing: boolean
  ): number => {
    evaluations++;
    const score = evaluateBoard(board);
    if (Math.abs(score) >= SCORE_WIN || depth === 0) return score;

    const currentAvailable: LocationKey[] = [];
    for (let i = 0; i < ALL_MOVES.length; i++) {
      if (!board[ALL_MOVES[i]]) currentAvailable.push(ALL_MOVES[i]);
    }

    if (currentAvailable.length === 0) return 0;

    const orderedMoves = orderMoves(board, currentAvailable, isMaximizing ? AI_PLAYER : HUMAN_PLAYER);

    if (isMaximizing) {
      let maxEval = -Infinity;
      for (const move of orderedMoves) {
        board[move] = AI_PLAYER;
        const ev = minimax(board, depth - 1, alpha, beta, false);
        delete board[move];
        if (ev > maxEval) maxEval = ev;
        if (ev > alpha) alpha = ev;
        if (beta <= alpha) break;
      }
      return maxEval;
    } else {
      let minEval = Infinity;
      for (const move of orderedMoves) {
        board[move] = HUMAN_PLAYER;
        const ev = minimax(board, depth - 1, alpha, beta, true);
        delete board[move];
        if (ev < minEval) minEval = ev;
        if (ev < beta) beta = ev;
        if (beta <= alpha) break;
      }
      return minEval;
    }
  };

  let bestScore = -Infinity;
  let bestMove: LocationKey | null = null;

  const rootOrderedMoves = orderMoves(board, availableMoves, AI_PLAYER);

  for (const move of rootOrderedMoves) {
    board[move] = AI_PLAYER;
    const score = minimax(board, depth - 1, -Infinity, Infinity, false);
    delete board[move];

    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }

  const endTime = performance.now();
  console.log(`[AI] Depth: ${depth}, Move: ${bestMove}, Evaluations: ${evaluations}, Time: ${(endTime - startTime).toFixed(2)}ms`);

  return bestMove;
};
