import { useMemo } from 'react';
import type { Board } from '../../types/game';
import { GameStatus } from '../../types/game';
import { Cell } from './cell';

interface GameBoardProps {
  board: Board;
  gameStatus: GameStatus;
  onReveal: (row: number, col: number) => void;
  onFlag: (row: number, col: number) => void;
}

export function GameBoard({ board, gameStatus, onReveal, onFlag }: GameBoardProps) {
  const height = board.length;
  const width = board[0]?.length ?? 0;

  const borderWidth = 3;
  const cellSize = useMemo(() => {
    const maxWidth = Math.min(window.innerWidth, 500);
    return Math.floor((maxWidth - borderWidth * 2) / width);
  }, [width]);

  const boardWidth = cellSize * width + borderWidth * 2;

  return (
    <div className="flex-1 flex justify-center overflow-hidden" style={{ touchAction: 'none' }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${width}, ${cellSize}px)`,
          gridTemplateRows: `repeat(${height}, ${cellSize}px)`,
          width: boardWidth,
          borderTop: `${borderWidth}px solid #808080`,
          borderLeft: `${borderWidth}px solid #808080`,
          borderBottom: `${borderWidth}px solid #ffffff`,
          borderRight: `${borderWidth}px solid #ffffff`,
        }}
      >
        {board.flat().map(cell => (
          <Cell
            key={`${cell.row}-${cell.col}`}
            cell={cell}
            cellSize={cellSize}
            gameStatus={gameStatus}
            onReveal={onReveal}
            onFlag={onFlag}
          />
        ))}
      </div>
    </div>
  );
}
