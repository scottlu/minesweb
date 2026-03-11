import { useState, useCallback, useRef, useEffect } from 'react';
import type { Board, GameSettings } from '../types/game';
import { GameStatus } from '../types/game';
import {
  createEmptyBoard,
  placeMines,
  placeMinesFromPositions,
  revealCell,
  toggleFlag,
  checkWin,
  revealAllMines,
  countFlags,
} from '../utils/board';
import { useTimer } from './useTimer';

const SAVE_KEY = 'minesweeper-game';

interface GameState {
  board: Board;
  status: GameStatus;
  minePositions: [number, number][] | null;
  minesPlaced: boolean;
}

interface SavedGame {
  state: GameState;
  time: number;
  settings: GameSettings;
}

function loadGame(settings: GameSettings): { state: GameState; time: number } | null {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    if (!raw) return null;
    const saved: SavedGame = JSON.parse(raw);
    if (
      saved.settings.width !== settings.width ||
      saved.settings.height !== settings.height ||
      saved.settings.mines !== settings.mines
    ) {
      return null;
    }
    if (saved.state.status === GameStatus.Idle) return null;
    return { state: saved.state, time: saved.time };
  } catch {
    return null;
  }
}

function saveGame(state: GameState, time: number, settings: GameSettings) {
  try {
    const saved: SavedGame = { state, time, settings };
    localStorage.setItem(SAVE_KEY, JSON.stringify(saved));
  } catch {}
}

function clearSave() {
  localStorage.removeItem(SAVE_KEY);
}

function makeDefaultState(settings: GameSettings): GameState {
  return {
    board: createEmptyBoard(settings.width, settings.height),
    status: GameStatus.Idle,
    minePositions: null,
    minesPlaced: false,
  };
}

export function useMinesweeper(settings: GameSettings) {
  const loaded = useRef(loadGame(settings));

  const [state, setState] = useState<GameState>(() =>
    loaded.current ? loaded.current.state : makeDefaultState(settings)
  );

  const settingsRef = useRef(settings);
  const preReviewStatusRef = useRef<GameStatus>(GameStatus.Idle);

  const isRunning = state.status === GameStatus.Playing;
  const { time, reset: resetTimer } = useTimer(isRunning, loaded.current?.time ?? 0);

  const flagCount = countFlags(state.board);
  const mineCount = settings.mines - flagCount;

  // Save game state on every change
  useEffect(() => {
    if (state.status === GameStatus.Idle) {
      clearSave();
    } else {
      saveGame(state, time, settings);
    }
  }, [state, time, settings]);

  // Reset game when settings change
  useEffect(() => {
    if (
      settingsRef.current.width !== settings.width ||
      settingsRef.current.height !== settings.height ||
      settingsRef.current.mines !== settings.mines
    ) {
      settingsRef.current = settings;
      setState(makeDefaultState(settings));
      resetTimer();
    }
  }, [settings, resetTimer]);

  const handleReveal = useCallback((row: number, col: number) => {
    setState(prev => {
      if (prev.status === GameStatus.Won || prev.status === GameStatus.Lost || prev.status === GameStatus.Review) {
        return prev;
      }
      if (prev.board[row][col].isRevealed || prev.board[row][col].isFlagged) {
        return prev;
      }

      let currentBoard = prev.board;
      let minePositions = prev.minePositions;
      let minesPlaced = prev.minesPlaced;

      if (!minesPlaced) {
        const result = placeMines(currentBoard, settings.mines, row, col);
        currentBoard = result.board;
        minePositions = result.minePositions;
        minesPlaced = true;
      }

      const { board: newBoard, hitMine } = revealCell(currentBoard, row, col);

      if (hitMine) {
        return {
          board: revealAllMines(newBoard),
          status: GameStatus.Lost,
          minePositions,
          minesPlaced,
        };
      }

      const won = checkWin(newBoard);
      return {
        board: newBoard,
        status: won ? GameStatus.Won : GameStatus.Playing,
        minePositions,
        minesPlaced,
      };
    });
  }, [settings.mines]);

  const handleFlag = useCallback((row: number, col: number) => {
    setState(prev => {
      if (prev.status === GameStatus.Won || prev.status === GameStatus.Lost || prev.status === GameStatus.Review) {
        return prev;
      }
      if (prev.board[row][col].isRevealed) return prev;
      return { ...prev, board: toggleFlag(prev.board, row, col) };
    });
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }
  }, []);

  const newGame = useCallback(() => {
    setState(makeDefaultState(settings));
    resetTimer();
    clearSave();
  }, [settings, resetTimer]);

  const tryAgain = useCallback(() => {
    setState(prev => {
      if (!prev.minePositions) {
        return makeDefaultState(settings);
      }
      const emptyBoard = createEmptyBoard(settings.width, settings.height);
      const boardWithMines = placeMinesFromPositions(emptyBoard, prev.minePositions);
      return {
        board: boardWithMines,
        status: GameStatus.Idle,
        minePositions: prev.minePositions,
        minesPlaced: true,
      };
    });
    resetTimer();
  }, [settings, resetTimer]);

  const review = useCallback(() => {
    setState(prev => {
      preReviewStatusRef.current = prev.status;
      return { ...prev, status: GameStatus.Review };
    });
  }, []);

  const displayStatus = state.status === GameStatus.Review ? preReviewStatusRef.current : state.status;

  return {
    board: state.board,
    status: state.status,
    displayStatus,
    flagCount,
    mineCount,
    time,
    handleReveal,
    handleFlag,
    newGame,
    tryAgain,
    review,
  };
}
