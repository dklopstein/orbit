import { getBestMove } from './ai';

self.onmessage = (e) => {
  const { board, difficulty } = e.data;
  const move = getBestMove(board, difficulty);
  self.postMessage(move);
};
