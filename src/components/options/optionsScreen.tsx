import { memo, useState, useCallback, useRef } from 'react';
import Slider from '@mui/material/Slider';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';

import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import type { GameSettings } from '../../types/game';

interface OptionsScreenProps {
  settings: GameSettings;
  onUpdateSettings: (partial: Partial<GameSettings>) => void;
  onBack: () => void;
  onPlay: () => void;
}

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

export const OptionsScreen = memo(function OptionsScreen({ settings, onUpdateSettings, onBack, onPlay }: OptionsScreenProps) {
  // Refs are the source of truth during drag; state drives the text display.
  // Sliders are uncontrolled (defaultValue) so MUI manages thumb position
  // natively — no React batching timing issues.
  const widthRef = useRef(settings.width);
  const heightRef = useRef(settings.height);
  const minesRef = useRef(settings.mines);

  // State is only used for the header text display and Play button commit.
  const [display, setDisplay] = useState({
    width: settings.width,
    height: settings.height,
    mines: settings.mines,
    showTimer: settings.showTimer,
  });

  // Key for the mines slider — forces remount when dimensions change so
  // its defaultValue and max update to reflect the new grid size.
  const [minesSliderKey, setMinesSliderKey] = useState(0);

  const totalCells = display.width * display.height;
  const ratio = totalCells > 0 ? ((display.mines / totalCells) * 100).toFixed(1) : '0.0';

  const handleShowTimerChange = useCallback((_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    setDisplay(prev => ({ ...prev, showTimer: checked }));
    onUpdateSettings({ showTimer: checked });
  }, [onUpdateSettings]);

  const handlePlay = useCallback(() => {
    onUpdateSettings({
      width: widthRef.current,
      height: heightRef.current,
      mines: minesRef.current,
    });
    onPlay();
  }, [onUpdateSettings, onPlay]);

  const handleWidthChange = useCallback((_: Event, v: number | number[]) => {
    const newWidth = v as number;
    const oldWidth = widthRef.current;
    widthRef.current = newWidth;

    const oldTotal = oldWidth * heightRef.current;
    const currentRatio = oldTotal > 0 ? minesRef.current / oldTotal : 0;
    const newTotal = newWidth * heightRef.current;
    const newMines = Math.max(1, Math.min(newTotal, Math.round(currentRatio * newTotal)));
    minesRef.current = newMines;

    setDisplay({ width: newWidth, height: heightRef.current, mines: newMines });
    setMinesSliderKey(k => k + 1);
  }, []);

  const handleHeightChange = useCallback((_: Event, v: number | number[]) => {
    const newHeight = v as number;
    const oldHeight = heightRef.current;
    heightRef.current = newHeight;

    const oldTotal = widthRef.current * oldHeight;
    const currentRatio = oldTotal > 0 ? minesRef.current / oldTotal : 0;
    const newTotal = widthRef.current * newHeight;
    const newMines = Math.max(1, Math.min(newTotal, Math.round(currentRatio * newTotal)));
    minesRef.current = newMines;

    setDisplay({ width: widthRef.current, height: newHeight, mines: newMines });
    setMinesSliderKey(k => k + 1);
  }, []);

  const handleMinesChange = useCallback((_: Event, v: number | number[]) => {
    const newMines = v as number;
    minesRef.current = newMines;
    setDisplay(prev => ({ ...prev, mines: newMines }));
  }, []);

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
              Custom - {display.width} x {display.height} / {display.mines} Mines ({ratio}%)
            </span>
          </div>

          <div className="flex items-center gap-3 mb-4" style={{ touchAction: 'none' }}>
            <span className="text-gray-700 w-14 text-sm font-medium">Width</span>
            <Slider
              defaultValue={settings.width}
              min={5}
              max={20}
              onChange={handleWidthChange}
              valueLabelDisplay="auto"
              sx={sliderSx}
            />
          </div>

          <div className="flex items-center gap-3 mb-4" style={{ touchAction: 'none' }}>
            <span className="text-gray-700 w-14 text-sm font-medium">Height</span>
            <Slider
              defaultValue={settings.height}
              min={5}
              max={30}
              onChange={handleHeightChange}
              valueLabelDisplay="auto"
              sx={sliderSx}
            />
          </div>

          <div className="flex items-center gap-3" style={{ touchAction: 'none' }}>
            <span className="text-gray-700 w-14 text-sm font-medium">Mines</span>
            <Slider
              key={minesSliderKey}
              defaultValue={minesRef.current}
              min={1}
              max={totalCells}
              onChange={handleMinesChange}
              valueLabelDisplay="auto"
              sx={sliderSx}
            />
          </div>

          <div className="flex items-center justify-between mt-2">
            <span className="text-gray-700 text-sm font-medium">Show Timer</span>
            <Switch
              checked={display.showTimer}
              onChange={handleShowTimerChange}
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
