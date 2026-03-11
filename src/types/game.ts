export interface CellData {
  row: number;
  col: number;
  isMine: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  adjacentMines: number;
  isDetonated: boolean;
}

export type Board = CellData[][];

export const GameStatus = {
  Idle: 'idle',
  Playing: 'playing',
  Won: 'won',
  Lost: 'lost',
  Review: 'review',
} as const;
export type GameStatus = (typeof GameStatus)[keyof typeof GameStatus];

export interface GameSettings {
  width: number;
  height: number;
  mines: number;
}

export const Screen = {
  Game: 'game',
  Options: 'options',
} as const;
export type Screen = (typeof Screen)[keyof typeof Screen];
