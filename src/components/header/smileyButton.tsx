import { GameStatus } from '../../types/game';

interface SmileyButtonProps {
  status: GameStatus;
  onClick: () => void;
}

function SmileyFace({ status }: { status: GameStatus }) {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28">
      <circle cx="14" cy="14" r="13" fill="#ffcc00" stroke="#000" strokeWidth="1" />
      {status === GameStatus.Won ? (
        <>
          {/* Sunglasses */}
          <rect x="5" y="9" width="7" height="5" rx="1" fill="#000" />
          <rect x="16" y="9" width="7" height="5" rx="1" fill="#000" />
          <rect x="12" y="10" width="4" height="2" fill="#000" />
          {/* Grin */}
          <path d="M 7 18 Q 14 25 21 18" fill="none" stroke="#000" strokeWidth="1.5" />
        </>
      ) : status === GameStatus.Lost ? (
        <>
          {/* X eyes */}
          <line x1="7" y1="8" x2="11" y2="13" stroke="#000" strokeWidth="1.5" />
          <line x1="11" y1="8" x2="7" y2="13" stroke="#000" strokeWidth="1.5" />
          <line x1="17" y1="8" x2="21" y2="13" stroke="#000" strokeWidth="1.5" />
          <line x1="21" y1="8" x2="17" y2="13" stroke="#000" strokeWidth="1.5" />
          {/* Open mouth */}
          <ellipse cx="14" cy="20" rx="4" ry="3" fill="#000" />
        </>
      ) : (
        <>
          {/* Eyes */}
          <circle cx="9" cy="11" r="2" fill="#000" />
          <circle cx="19" cy="11" r="2" fill="#000" />
          {/* Smile */}
          <path d="M 8 18 Q 14 23 20 18" fill="none" stroke="#000" strokeWidth="1.5" />
        </>
      )}
    </svg>
  );
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
      <SmileyFace status={status} />
    </button>
  );
}
