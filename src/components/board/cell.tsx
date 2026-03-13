import { memo, useRef, useCallback } from 'react';
import type { CellData } from '../../types/game';
import { GameStatus } from '../../types/game';
import '../../styles/cell.css';

const NUMBER_COLORS: Record<number, string> = {
  1: '#0000ff',
  2: '#008000',
  3: '#ff0000',
  4: '#000080',
  5: '#800000',
  6: '#008080',
  7: '#000000',
  8: '#808080',
};

interface CellProps {
  cell: CellData;
  cellSize: number;
  gameStatus: GameStatus;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
}

const LONG_PRESS_MS = 400;

export const Cell = memo(function Cell({ cell, cellSize, gameStatus, onReveal, onFlag }: CellProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const longPressedRef = useRef(false);
  const startPosRef = useRef<{ x: number; y: number } | null>(null);
  const isTouchRef = useRef(false);

  const isGameOver = gameStatus === GameStatus.Won || gameStatus === GameStatus.Lost || gameStatus === GameStatus.Review;

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const startLongPress = useCallback((x: number, y: number) => {
    if (isGameOver || cell.isRevealed) return;
    longPressedRef.current = false;
    startPosRef.current = { x, y };
    timerRef.current = setTimeout(() => {
      longPressedRef.current = true;
      onFlag(cell.row, cell.col);
    }, LONG_PRESS_MS);
  }, [isGameOver, cell.isRevealed, cell.row, cell.col, onFlag]);

  const checkMove = useCallback((x: number, y: number) => {
    if (!startPosRef.current) return;
    const dx = x - startPosRef.current.x;
    const dy = y - startPosRef.current.y;
    if (Math.abs(dx) > 10 || Math.abs(dy) > 10) {
      clearTimer();
    }
  }, [clearTimer]);

  // Touch handlers
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    isTouchRef.current = true;
    const touch = e.touches[0];
    startLongPress(touch.clientX, touch.clientY);
  }, [startLongPress]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0];
    checkMove(touch.clientX, touch.clientY);
  }, [checkMove]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    clearTimer();
    if (isGameOver || cell.isRevealed) return;
    if (longPressedRef.current) {
      e.preventDefault();
      return;
    }
    e.preventDefault();
    onReveal(cell.row, cell.col);
  }, [clearTimer, isGameOver, cell.isRevealed, cell.row, cell.col, onReveal]);

  // Mouse handlers (PC long-press)
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isTouchRef.current) return; // ignore synthetic mouse events from touch
    if (e.button !== 0) return; // left button only
    startLongPress(e.clientX, e.clientY);
  }, [startLongPress]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isTouchRef.current) return;
    checkMove(e.clientX, e.clientY);
  }, [checkMove]);

  const handleMouseUp = useCallback(() => {
    if (isTouchRef.current) return;
    clearTimer();
  }, [clearTimer]);

  const handleClick = useCallback(() => {
    if (isTouchRef.current) {
      isTouchRef.current = false;
      return;
    }
    if (isGameOver || cell.isRevealed) return;
    if (longPressedRef.current) {
      longPressedRef.current = false;
      return;
    }
    onReveal(cell.row, cell.col);
  }, [isGameOver, cell.isRevealed, cell.row, cell.col, onReveal]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    if (isTouchRef.current) return; // touch long-press already handled flagging
    if (isGameOver || cell.isRevealed) return;
    onFlag(cell.row, cell.col);
  }, [isGameOver, cell.isRevealed, cell.row, cell.col, onFlag]);

  const fontSize = Math.floor(cellSize * 0.7);

  let className = 'cell';
  if (!cell.isRevealed) {
    className += ' cell-unrevealed';
  } else if (cell.isDetonated) {
    className += ' cell-mine-hit';
  } else {
    className += ' cell-revealed';
  }

  let content = null;

  if (cell.isFlagged && !cell.isRevealed) {
    const flagSize = cellSize * 0.6;
    content = (
      <svg
        className="flag-icon"
        key={`flag-${cell.row}-${cell.col}`}
        width={flagSize}
        height={flagSize}
        viewBox="0 0 24 24"
        style={{ overflow: 'visible' }}
      >
        <rect x="5" y="3" width="13" height="10" fill="#ff0000" />
        <rect x="4" y="2" width="2" height="20" fill="#000" />
        <rect x="2" y="20" width="8" height="2" fill="#000" />
      </svg>
    );
  } else if (cell.isRevealed && cell.isMine) {
    const mineSize = cellSize * 0.65;
    content = (
      <svg width={mineSize} height={mineSize} viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="7" fill="#000" />
        <rect x="11" y="1" width="2" height="22" fill="#000" />
        <rect x="1" y="11" width="22" height="2" fill="#000" />
        <rect x="4.5" y="4.5" width="2" height="15" fill="#000" transform="rotate(45 12 12)" />
        <rect x="4.5" y="4.5" width="2" height="15" fill="#000" transform="rotate(-45 12 12)" />
        <circle cx="9" cy="9" r="2" fill="#fff" />
      </svg>
    );
  } else if (cell.isRevealed && cell.adjacentMines > 0) {
    content = (
      <span
        className="cell-number"
        style={{ color: NUMBER_COLORS[cell.adjacentMines], fontSize }}
      >
        {cell.adjacentMines}
      </span>
    );
  }

  return (
    <div
      className={className}
      style={{ width: cellSize, height: cellSize }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={handleClick}
      onContextMenu={handleContextMenu}
    >
      {content}
    </div>
  );
});
