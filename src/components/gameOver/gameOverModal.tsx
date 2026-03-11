import Button from '@mui/material/Button';
import type { GameSettings } from '../../types/game';
import { GameStatus } from '../../types/game';

interface GameOverModalProps {
  status: GameStatus;
  time: number;
  settings: GameSettings;
  onNewGame: () => void;
  onTryAgain: () => void;
  onReview: () => void;
}

function LetterTiles({ text }: { text: string }) {
  const words = text.split(' ');
  return (
    <div className="flex gap-2 justify-center">
      {words.map((word, wi) => (
        <div key={wi} className="flex gap-0.5">
          {word.split('').map((letter, li) => (
            <div
              key={li}
              className="flex items-center justify-center font-bold text-white"
              style={{
                width: 36,
                height: 36,
                backgroundColor: '#333',
                borderRadius: 4,
                fontSize: 20,
              }}
            >
              {letter}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}

export function GameOverModal({ status, time, settings, onNewGame, onTryAgain, onReview }: GameOverModalProps) {
  const isWon = status === GameStatus.Won;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)' }}
    >
      <div className="flex flex-col items-center gap-4 p-6 rounded-lg" style={{ background: '#d0d0d0' }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: 60,
            height: 60,
            backgroundColor: isWon ? '#4caf50' : '#f44336',
            borderRadius: 12,
            fontSize: 32,
          }}
        >
          💣
        </div>

        <LetterTiles text={isWon ? 'GAME WON' : 'GAME LOST'} />

        <div className="text-center text-sm" style={{ color: '#333' }}>
          <div>Game Mode: Custom</div>
          <div>
            {settings.width} x {settings.height} / {settings.mines} Mines
          </div>
          {isWon && <div>Time: {time}s</div>}
        </div>

        <div className="flex flex-col gap-2 w-full">
          <Button variant="contained" fullWidth onClick={onNewGame}>
            New Game
          </Button>
          <Button variant="contained" fullWidth onClick={onTryAgain}>
            Try Again
          </Button>
          <Button variant="contained" fullWidth onClick={onReview}>
            Review
          </Button>
        </div>
      </div>
    </div>
  );
}
