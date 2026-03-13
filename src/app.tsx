import { useState, useCallback, useEffect, useRef } from 'react';
import { Screen, GameStatus } from './types/game';
import { useMinesweeper } from './hooks/useMinesweeper';
import { useSettings } from './hooks/useSettings';
import { Header } from './components/header/header';
import { GameBoard } from './components/board/gameBoard';
import { GameEffect } from './components/gameOver/gameEffect';
import { OptionsScreen } from './components/options/optionsScreen';

export default function App() {
  const [screen, setScreen] = useState<Screen>(Screen.Game);
  const { settings, updateSettings } = useSettings();
  const game = useMinesweeper(settings);
  const [effect, setEffect] = useState<'fireworks' | null>(null);
  const prevStatusRef = useRef(game.status);

  // Trigger effects on game end
  useEffect(() => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = game.status;

    if (prev === game.status) return;

    if (game.status === GameStatus.Won) {
      setEffect('fireworks');
    }
  }, [game.status]);

  const handleEffectComplete = useCallback(() => {
    setEffect(null);
  }, []);

  const handleReplayEffect = useCallback(() => {
    if (game.status === GameStatus.Won) {
      setEffect(null);
      // Force re-mount by toggling off then on in next tick
      requestAnimationFrame(() => setEffect('fireworks'));
    }
  }, [game.status]);

  const handlePlay = useCallback(() => {
    game.newGame();
    setScreen(Screen.Game);
  }, [game.newGame]);

  return (
    <div className="flex flex-col h-full">
      {screen === Screen.Game && (
        <>
          <Header
            mineCount={game.mineCount}
            time={game.time}
            status={game.displayStatus}
            onSmileyClick={game.newGame}
            onSettingsClick={() => setScreen(Screen.Options)}
            onReplayEffect={handleReplayEffect}
          />
          <GameBoard
            board={game.board}
            gameStatus={game.status}
            onReveal={game.handleReveal}
            onFlag={game.handleFlag}
            onBoardTap={effect ? handleEffectComplete : undefined}
          />
          {effect && (
            <GameEffect onComplete={handleEffectComplete} />
          )}
        </>
      )}
      {screen === Screen.Options && (
        <OptionsScreen
          settings={settings}
          onUpdateSettings={updateSettings}
          onBack={() => setScreen(Screen.Game)}
          onPlay={handlePlay}
        />
      )}
    </div>
  );
}
