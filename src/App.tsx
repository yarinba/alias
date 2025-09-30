import { useGameState } from './hooks/useGameState';
import { MenuScreen } from './components/MenuScreen';
import { GameScreen } from './components/GameScreen';
import { RoundEndScreen } from './components/RoundEndScreen';
import './App.css';

function App() {
  const { gameData, startRound, markSuccess, markBurn, resetToMenu } = useGameState();

  return (
    <div className="app">
      {gameData.currentState === 'menu' && (
        <MenuScreen onStartRound={startRound} />
      )}

      {gameData.currentState === 'playing' && (
        <GameScreen
          currentCardWords={gameData.currentCardWords}
          timeRemaining={gameData.timeRemaining}
          successCount={gameData.succeededCards.length}
          burnCount={gameData.burnedCards.length}
          succeededCards={gameData.succeededCards}
          burnedCards={gameData.burnedCards}
          onSuccess={markSuccess}
          onBurn={markBurn}
        />
      )}

      {gameData.currentState === 'round_end' && (
        <RoundEndScreen
          successCount={gameData.succeededCards.length}
          burnCount={gameData.burnedCards.length}
          succeededCards={gameData.succeededCards}
          burnedCards={gameData.burnedCards}
          onReturnToMenu={resetToMenu}
        />
      )}
    </div>
  );
}

export default App;
