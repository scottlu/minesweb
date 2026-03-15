import { useState, useEffect } from 'react';
import IconButton from '@mui/material/IconButton';
import TuneIcon from '@mui/icons-material/Tune';
import RefreshIcon from '@mui/icons-material/Refresh';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CircularProgress from '@mui/material/CircularProgress';
import { LedDisplay } from './ledDisplay';
import { SmileyButton } from './smileyButton';
import { GameStatus } from '../../types/game';

type RefreshState = 'idle' | 'loading' | 'done';

function getInitialRefreshState(): RefreshState {
  const params = new URLSearchParams(window.location.search);
  if (params.has('reloaded')) {
    // Clean the URL without triggering a navigation
    params.delete('reloaded');
    const query = params.toString();
    const newUrl = window.location.pathname + (query ? `?${query}` : '');
    window.history.replaceState({}, '', newUrl);
    return 'done';
  }
  return 'idle';
}

interface HeaderProps {
  mineCount: number;
  time: number;
  status: GameStatus;
  onSmileyClick: () => void;
  onSettingsClick: () => void;
  onReplayEffect?: () => void;
}

export function Header({ mineCount, time, status, onSmileyClick, onSettingsClick, onReplayEffect }: HeaderProps) {
  const [refreshState, setRefreshState] = useState<RefreshState>(getInitialRefreshState);

  useEffect(() => {
    if (refreshState === 'done') {
      const timer = setTimeout(() => {
        setRefreshState('idle');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [refreshState]);

  const handleRefresh = () => {
    setRefreshState('loading');
    requestAnimationFrame(() => {
      const url = new URL(window.location.href);
      url.searchParams.set('v', String(Date.now()));
      url.searchParams.set('reloaded', '1');
      window.location.href = url.toString();
    });
  };

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
        <LedDisplay value={mineCount} onClick={onReplayEffect} />
        <SmileyButton status={status} onClick={onSmileyClick} />
        <LedDisplay value={time} onClick={onReplayEffect} />
      </div>

      {refreshState === 'loading' && (
        <IconButton size="small" disabled>
          <CircularProgress size={24} sx={{ color: '#616161' }} />
        </IconButton>
      )}
      {refreshState === 'done' && (
        <IconButton size="small" disabled>
          <CheckCircleIcon sx={{ color: '#4caf50' }} />
        </IconButton>
      )}
      {refreshState === 'idle' && (
        <IconButton onClick={handleRefresh} size="small">
          <RefreshIcon />
        </IconButton>
      )}
    </div>
  );
}
