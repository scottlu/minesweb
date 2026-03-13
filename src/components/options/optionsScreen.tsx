import { useState } from 'react';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';

import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import type { GameSettings } from '../../types/game';

interface OptionsScreenProps {
  settings: GameSettings;
  onUpdateSettings: (partial: Partial<GameSettings>) => void;
  onBack: () => void;
  onPlay: () => void;
}

export function OptionsScreen({ settings, onUpdateSettings, onBack, onPlay }: OptionsScreenProps) {
  const [width, setWidth] = useState(settings.width);
  const [height, setHeight] = useState(settings.height);
  const [mines, setMines] = useState(settings.mines);

  const handlePlay = () => {
    const maxMines = Math.floor(width * height * 0.8);
    onUpdateSettings({ width, height, mines: Math.min(mines, maxMines) });
    onPlay();
  };

  return (
    <div className="flex flex-col h-full" style={{ background: '#f5f5f5' }}>
      <div className="flex items-center px-2 py-2" style={{ borderBottom: '1px solid #ddd' }}>
        <IconButton onClick={onBack}>
          <ChevronLeftIcon />
        </IconButton>
      </div>

      <div className="flex-1 flex flex-col justify-end p-4 gap-4">
        <div
          className="rounded-lg p-4"
          style={{ background: 'linear-gradient(135deg, #90caf9, #a5d6f7)' }}
        >
          <div className="flex items-center gap-2 mb-4">
            <span style={{ fontSize: 28 }}>😄</span>
            <span className="font-bold text-gray-800">
              Custom - {width} x {height} / {mines} Mines
            </span>
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-gray-700 w-14 text-sm font-medium">Width</span>
            <Slider
              value={width}
              min={5}
              max={20}
              onChange={(_, v) => setWidth(v as number)}
              size="small"
            />
          </div>

          <div className="flex items-center gap-3 mb-2">
            <span className="text-gray-700 w-14 text-sm font-medium">Height</span>
            <Slider
              value={height}
              min={5}
              max={30}
              onChange={(_, v) => setHeight(v as number)}
              size="small"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-700 w-14 text-sm font-medium">Mines</span>
            <Slider
              value={mines}
              min={1}
              max={200}
              onChange={(_, v) => setMines(v as number)}
              size="small"
            />
          </div>
        </div>

        <Button variant="contained" size="large" fullWidth onClick={handlePlay}>
          Play
        </Button>
      </div>
    </div>
  );
}
