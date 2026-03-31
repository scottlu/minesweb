import type { Board } from '../types/game';

/**
 * Rotates a board 90 degrees clockwise for landscape display.
 * Original CellData objects are reused, preserving their .row/.col
 * so click handlers automatically map back to game coordinates.
 */
export function transposeBoard(board: Board): Board {
  const origHeight = board.length;
  const origWidth = board[0]?.length ?? 0;
  const transposed: Board = [];
  for (let newR = 0; newR < origWidth; newR++) {
    const row = [];
    for (let newC = 0; newC < origHeight; newC++) {
      row.push(board[origHeight - 1 - newC][newR]);
    }
    transposed.push(row);
  }
  return transposed;
}
