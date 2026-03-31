import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Screen, GameStatus } from './types/game';
import { useMinesweeper } from './hooks/useMinesweeper';
import { useSettings } from './hooks/useSettings';
import { useOrientation } from './hooks/useOrientation';
import { Header } from './components/header/header';
import { GameBoard } from './components/board/gameBoard';
import { GameEffect } from './components/gameOver/gameEffect';
import { OptionsScreen } from './components/options/optionsScreen';
import { transposeBoard } from './utils/transpose';

export default function App() {
  const [screen, setScreen] = useState<Screen>(Screen.Game);
  const { settings, updateSettings } = useSettings();
  const game = useMinesweeper(settings);
  const { isLandscape } = useOrientation();
  const displayBoard = useMemo(
    () => (isLandscape ? transposeBoard(game.board) : game.board),
    [game.board, isLandscape]
  );
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

  const handleBack = useCallback(() => {
    setScreen(Screen.Game);
  }, []);

  const handlePlay = useCallback(() => {
    game.newGame();
    setScreen(Screen.Game);
  }, [game.newGame]);

  return (
    <div className="app-root flex flex-col h-full">
      {screen === Screen.Game && (
        <>
          <Header
            mineCount={game.mineCount}
            time={game.time}
            status={game.displayStatus}
            showTimer={settings.showTimer}
            onSmileyClick={() => { setEffect(null); game.newGame(); }}
            onSettingsClick={() => setScreen(Screen.Options)}
            onReplayEffect={handleReplayEffect}
          />
          <GameBoard
            key={game.gameId}
            board={displayBoard}
            gameStatus={game.status}
            effectiveWidth={window.innerWidth}
            effectiveHeight={window.innerHeight}
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
          onBack={handleBack}
          onPlay={handlePlay}
        />
      )}
    </div>
  );
}
