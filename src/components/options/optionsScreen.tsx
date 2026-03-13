import { memo, useState } from 'react';
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

export const OptionsScreen = memo(function OptionsScreen({ settings, onUpdateSettings, onBack, onPlay }: OptionsScreenProps) {
  const [width, setWidth] = useState(settings.width);
  const [height, setHeight] = useState(settings.height);
  const [mines, setMines] = useState(settings.mines);

  const maxMines = Math.floor(width * height * 0.8);

  const handlePlay = () => {
    onUpdateSettings({ width, height, mines: Math.min(mines, maxMines) });
    onPlay();
  };

  const handleWidthChange = (_: Event, v: number | number[]) => {
    const newWidth = v as number;
    setWidth(newWidth);
    const newMax = Math.floor(newWidth * height * 0.8);
    if (mines > newMax) {
      setMines(newMax);
    }
  };

  const handleHeightChange = (_: Event, v: number | number[]) => {
    const newHeight = v as number;
    setHeight(newHeight);
    const newMax = Math.floor(width * newHeight * 0.8);
    if (mines > newMax) {
      setMines(newMax);
    }
  };

  const sliderSx = {
    height: 8,
    '& .MuiSlider-thumb': {
      width: 28,
      height: 28,
    },
    '& .MuiSlider-rail': {
      opacity: 0.4,
    },
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

          <div className="flex items-center gap-3 mb-4">
            <span className="text-gray-700 w-14 text-sm font-medium">Width</span>
            <Slider
              value={width}
              min={5}
              max={20}
              onChange={handleWidthChange}
              valueLabelDisplay="auto"
              sx={sliderSx}
            />
          </div>

          <div className="flex items-center gap-3 mb-4">
            <span className="text-gray-700 w-14 text-sm font-medium">Height</span>
            <Slider
              value={height}
              min={5}
              max={30}
              onChange={handleHeightChange}
              valueLabelDisplay="auto"
              sx={sliderSx}
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-gray-700 w-14 text-sm font-medium">Mines</span>
            <Slider
              value={Math.min(mines, maxMines)}
              min={1}
              max={maxMines}
              onChange={(_, v) => setMines(v as number)}
              valueLabelDisplay="auto"
              sx={sliderSx}
            />
          </div>
        </div>

        <Button variant="contained" size="large" fullWidth onClick={handlePlay}>
          Play
        </Button>
      </div>
    </div>
  );
});
