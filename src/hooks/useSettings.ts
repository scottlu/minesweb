import { useState, useCallback } from 'react';
import type { GameSettings } from '../types/game';

const STORAGE_KEY = 'minesweeper-settings';

const HEADER_HEIGHT = 58; // 56px header + 2px border
const BOARD_BORDER = 6; // 3px border on each side
const MAX_BOARD_WIDTH = 500;
const TARGET_CELL_SIZE = 35;
const MIN_WIDTH = 5;
const MAX_WIDTH = 20;
const MIN_HEIGHT = 5;
const MAX_HEIGHT = 30;

function computeDefaultSettings(): GameSettings {
  const availableWidth = Math.min(window.innerWidth, MAX_BOARD_WIDTH) - BOARD_BORDER;
  const availableHeight = window.innerHeight - HEADER_HEIGHT - BOARD_BORDER;

  const width = Math.max(MIN_WIDTH, Math.min(MAX_WIDTH, Math.floor(availableWidth / TARGET_CELL_SIZE)));
  const height = Math.max(MIN_HEIGHT, Math.min(MAX_HEIGHT, Math.floor(availableHeight / TARGET_CELL_SIZE)));
  const mines = Math.max(1, Math.round(width * height * 0.2));

  return { width, height, mines };
}

function loadSettings(): GameSettings {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const defaults = computeDefaultSettings();
      return { ...defaults, ...JSON.parse(stored) };
    }
  } catch {}
  return computeDefaultSettings();
}

export function useSettings() {
  const [settings, setSettings] = useState<GameSettings>(loadSettings);

  const updateSettings = useCallback((partial: Partial<GameSettings>) => {
    setSettings(prev => {
      const next = { ...prev, ...partial };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return { settings, updateSettings };
}
