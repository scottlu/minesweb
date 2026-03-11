import type { Board, CellData } from '../types/game';

const DIRECTIONS = [
  [-1, -1], [-1, 0], [-1, 1],
  [0, -1],           [0, 1],
  [1, -1],  [1, 0],  [1, 1],
];

export function createEmptyBoard(width: number, height: number): Board {
  const board: Board = [];
  for (let r = 0; r < height; r++) {
    const row: CellData[] = [];
    for (let c = 0; c < width; c++) {
      row.push({
        row: r,
        col: c,
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
        isDetonated: false,
      });
    }
    board.push(row);
  }
  return board;
}

function getNeighbors(row: number, col: number, height: number, width: number): [number, number][] {
  const neighbors: [number, number][] = [];
  for (const [dr, dc] of DIRECTIONS) {
    const nr = row + dr;
    const nc = col + dc;
    if (nr >= 0 && nr < height && nc >= 0 && nc < width) {
      neighbors.push([nr, nc]);
    }
  }
  return neighbors;
}

function computeAdjacentMines(board: Board): void {
  const height = board.length;
  const width = board[0].length;
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (board[r][c].isMine) continue;
      let count = 0;
      for (const [nr, nc] of getNeighbors(r, c, height, width)) {
        if (board[nr][nc].isMine) count++;
      }
      board[r][c].adjacentMines = count;
    }
  }
}

export function placeMines(
  board: Board,
  mineCount: number,
  safeRow: number,
  safeCol: number,
): { board: Board; minePositions: [number, number][] } {
  const height = board.length;
  const width = board[0].length;
  const newBoard = cloneBoard(board);

  const safeZone = new Set<string>();
  safeZone.add(`${safeRow},${safeCol}`);
  for (const [nr, nc] of getNeighbors(safeRow, safeCol, height, width)) {
    safeZone.add(`${nr},${nc}`);
  }

  const candidates: [number, number][] = [];
  for (let r = 0; r < height; r++) {
    for (let c = 0; c < width; c++) {
      if (!safeZone.has(`${r},${c}`)) {
        candidates.push([r, c]);
      }
    }
  }

  // Shuffle and pick
  for (let i = candidates.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [candidates[i], candidates[j]] = [candidates[j], candidates[i]];
  }

  const actualCount = Math.min(mineCount, candidates.length);
  const minePositions = candidates.slice(0, actualCount);

  for (const [r, c] of minePositions) {
    newBoard[r][c].isMine = true;
  }

  computeAdjacentMines(newBoard);
  return { board: newBoard, minePositions };
}

export function placeMinesFromPositions(
  board: Board,
  positions: [number, number][],
): Board {
  const newBoard = cloneBoard(board);
  for (const [r, c] of positions) {
    newBoard[r][c].isMine = true;
  }
  computeAdjacentMines(newBoard);
  return newBoard;
}

export function revealCell(
  board: Board,
  row: number,
  col: number,
): { board: Board; hitMine: boolean } {
  const newBoard = cloneBoard(board);
  const cell = newBoard[row][col];

  if (cell.isRevealed || cell.isFlagged) {
    return { board: newBoard, hitMine: false };
  }

  if (cell.isMine) {
    cell.isRevealed = true;
    cell.isDetonated = true;
    return { board: newBoard, hitMine: true };
  }

  // BFS flood-fill
  const queue: [number, number][] = [[row, col]];
  const visited = new Set<string>();
  visited.add(`${row},${col}`);
  const height = newBoard.length;
  const width = newBoard[0].length;

  while (queue.length > 0) {
    const [r, c] = queue.shift()!;
    const current = newBoard[r][c];
    current.isRevealed = true;

    if (current.adjacentMines === 0) {
      for (const [nr, nc] of getNeighbors(r, c, height, width)) {
        const key = `${nr},${nc}`;
        if (!visited.has(key) && !newBoard[nr][nc].isMine && !newBoard[nr][nc].isFlagged) {
          visited.add(key);
          queue.push([nr, nc]);
        }
      }
    }
  }

  return { board: newBoard, hitMine: false };
}

export function toggleFlag(board: Board, row: number, col: number): Board {
  const newBoard = cloneBoard(board);
  const cell = newBoard[row][col];
  if (!cell.isRevealed) {
    cell.isFlagged = !cell.isFlagged;
  }
  return newBoard;
}

export function checkWin(board: Board): boolean {
  for (const row of board) {
    for (const cell of row) {
      if (!cell.isMine && !cell.isRevealed) return false;
    }
  }
  return true;
}

export function revealAllMines(board: Board): Board {
  const newBoard = cloneBoard(board);
  for (const row of newBoard) {
    for (const cell of row) {
      if (cell.isMine) {
        cell.isRevealed = true;
      }
    }
  }
  return newBoard;
}

export function countFlags(board: Board): number {
  let count = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell.isFlagged) count++;
    }
  }
  return count;
}

function cloneBoard(board: Board): Board {
  return board.map(row => row.map(cell => ({ ...cell })));
}
