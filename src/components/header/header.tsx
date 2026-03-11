import IconButton from '@mui/material/IconButton';
import TuneIcon from '@mui/icons-material/Tune';
import { LedDisplay } from './ledDisplay';
import { SmileyButton } from './smileyButton';
import { GameStatus } from '../../types/game';

interface HeaderProps {
  mineCount: number;
  time: number;
  status: GameStatus;
  onSmileyClick: () => void;
  onSettingsClick: () => void;
}

export function Header({ mineCount, time, status, onSmileyClick, onSettingsClick }: HeaderProps) {
  return (
    <div
      className="flex items-center justify-between px-2"
      style={{
        height: 56,
        background: '#c0c0c0',
        borderBottom: '2px solid #808080',
      }}
    >
      <IconButton onClick={onSettingsClick} size="small">
        <TuneIcon />
      </IconButton>

      <div className="flex items-center gap-2">
        <LedDisplay value={mineCount} />
        <SmileyButton status={status} onClick={onSmileyClick} />
        <LedDisplay value={time} />
      </div>

      <div style={{ width: 40 }} />
    </div>
  );
}
