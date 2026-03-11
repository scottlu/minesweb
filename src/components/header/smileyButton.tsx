import { GameStatus } from '../../types/game';

interface SmileyButtonProps {
  status: GameStatus;
  onClick: () => void;
}

function SmileyFace() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="13" fill="#ffcc00" stroke="#000" strokeWidth="1" />
      <circle cx="9" cy="11" r="2" fill="#000" />
      <circle cx="19" cy="11" r="2" fill="#000" />
      <path d="M 8 18 Q 14 23 20 18" fill="none" stroke="#000" strokeWidth="1.5" />
    </svg>
  );
}

function ThumbsIcon({ flip }: { flip?: boolean }) {
  return (
    <svg width="28" height="28" viewBox="0 0 64 64" style={flip ? { transform: 'scaleY(-1)', marginTop: 2 } : undefined}>
      {/* Wrist/palm base */}
      <rect x="5" y="30" width="14" height="24" rx="3" fill="#f5c33b" stroke="#000" strokeWidth="2.5" />
      {/* Palm */}
      <path d="M 19 30 L 19 52 Q 19 56 23 56 L 42 56 Q 48 56 50 50 L 54 38 Q 56 32 50 30 L 34 30 L 36 22 Q 38 14 32 12 Q 28 10 26 14 L 19 30 Z" fill="#f5c33b" stroke="#000" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Finger lines */}
      <line x1="24" y1="38" x2="46" y2="38" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="44" x2="44" y2="44" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="24" y1="50" x2="42" y2="50" stroke="#000" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function getIcon(status: GameStatus) {
  switch (status) {
    case GameStatus.Won:
      return <ThumbsIcon />;
    case GameStatus.Lost:
      return <ThumbsIcon flip />;
    default:
      return <SmileyFace />;
  }
}

export function SmileyButton({ status, onClick }: SmileyButtonProps) {
  return (
    <button
      onClick={onClick}
      className="flex items-center justify-center"
      style={{
        width: 40,
        height: 40,
        background: '#c0c0c0',
        borderTop: '3px solid #ffffff',
        borderLeft: '3px solid #ffffff',
        borderBottom: '3px solid #808080',
        borderRight: '3px solid #808080',
        cursor: 'pointer',
        padding: 0,
        borderRadius: 0,
      }}
    >
      {getIcon(status)}
    </button>
  );
}
