import { useState, useCallback } from 'react';
import { Screen, GameStatus } from './types/game';
import { useMinesweeper } from './hooks/useMinesweeper';
import { useSettings } from './hooks/useSettings';
import { Header } from './components/header/header';
import { GameBoard } from './components/board/gameBoard';
import { GameOverModal } from './components/gameOver/gameOverModal';
import { OptionsScreen } from './components/options/optionsScreen';

export default function App() {
  const [screen, setScreen] = useState<Screen>(Screen.Game);
  const { settings, updateSettings } = useSettings();
  const game = useMinesweeper(settings);

  const handlePlay = useCallback(() => {
    game.newGame();
    setScreen(Screen.Game);
  }, [game.newGame]);

  const showGameOver =
    game.status === GameStatus.Won || game.status === GameStatus.Lost;

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
          />
          <GameBoard
            board={game.board}
            gameStatus={game.status}
            onReveal={game.handleReveal}
            onFlag={game.handleFlag}
          />
          {showGameOver && (
            <GameOverModal
              status={game.status}
              time={game.time}
              settings={settings}
              onNewGame={game.newGame}
              onTryAgain={game.tryAgain}
              onReview={game.review}
            />
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
