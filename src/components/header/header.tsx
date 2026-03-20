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

async function updateServiceWorker(): Promise<void> {
  if (!('serviceWorker' in navigator)) {
    return;
  }

  const registration = await navigator.serviceWorker.getRegistration();
  if (!registration) {
    return;
  }

  // Force check for a new service worker
  await registration.update();

  // With registerType: 'autoUpdate', the new SW calls skipWaiting() on install,
  // so it activates immediately. If there's still a waiting worker, wait for it
  // to take control before reloading.
  if (registration.waiting || registration.installing) {
    await new Promise<void>((resolve) => {
      const onControllerChange = () => {
        navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
        resolve();
      };
      navigator.serviceWorker.addEventListener('controllerchange', onControllerChange);

      // Don't wait forever
      setTimeout(() => {
        navigator.serviceWorker.removeEventListener('controllerchange', onControllerChange);
        resolve();
      }, 3000);
    });
  }
}

interface HeaderProps {
  mineCount: number;
  time: number;
  status: GameStatus;
  showTimer: boolean;
  onSmileyClick: () => void;
  onSettingsClick: () => void;
  onReplayEffect?: () => void;
}

export function Header({ mineCount, time, status, showTimer, onSmileyClick, onSettingsClick, onReplayEffect }: HeaderProps) {
  const [refreshState, setRefreshState] = useState<RefreshState>(getInitialRefreshState);

  useEffect(() => {
    if (refreshState === 'done') {
      const timer = setTimeout(() => {
        setRefreshState('idle');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [refreshState]);

  const handleRefresh = async () => {
    setRefreshState('loading');
    await updateServiceWorker();
    const url = new URL(window.location.href);
    url.searchParams.set('reloaded', '1');
    window.location.href = url.toString();
  };

  return (
    <div
      className="relative flex items-center justify-center px-2"
      style={{
        height: 56,
        background: '#c0c0c0',
        borderBottom: '2px solid #808080',
      }}
    >
      <div className="absolute left-2">
        <IconButton onClick={onSettingsClick} size="small">
          <TuneIcon />
        </IconButton>
      </div>

      <div className="flex items-center gap-2">
        <LedDisplay value={mineCount} onClick={onReplayEffect} />
        <SmileyButton status={status} onClick={onSmileyClick} />
        {showTimer && <LedDisplay value={time} onClick={onReplayEffect} />}
      </div>

      <div className="absolute right-2">
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
    </div>
  );
}
