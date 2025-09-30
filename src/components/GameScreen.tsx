import { useState } from 'react';
import { Card } from './Card';
import { HistoryDrawer } from './HistoryDrawer';
import { soundManager } from '../utils/sounds';

interface GameScreenProps {
  currentCardWords: string[];
  timeRemaining: number;
  successCount: number;
  burnCount: number;
  succeededCards: string[];
  burnedCards: string[];
  onSuccess: () => void;
  onBurn: () => void;
}

export const GameScreen = ({
  currentCardWords,
  timeRemaining,
  successCount,
  burnCount,
  succeededCards,
  burnedCards,
  onSuccess,
  onBurn,
}: GameScreenProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleSuccess = () => {
    soundManager.play('success');
    onSuccess();
  };

  const handleBurn = () => {
    soundManager.play('burn');
    onBurn();
  };

  const getTimerClass = () => {
    if (timeRemaining <= 10) return 'timer danger';
    if (timeRemaining <= 20) return 'timer warning';
    return 'timer';
  };

  return (
    <div className="screen active">
      <div className="game-container">
        {/* Timer and Counter */}
        <div className="game-header">
          <div className={getTimerClass()}>{timeRemaining}</div>
          <div className="counter">
            <span className="success-count">הצלחות: <span>{successCount}</span></span>
            <span className="burn-count">שריפות: <span>{burnCount}</span></span>
          </div>
        </div>

        {/* Current Card */}
        <Card words={currentCardWords} />

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={handleSuccess} className="action-btn success-btn">
            הצלחה ✓
          </button>
          <button onClick={handleBurn} className="action-btn burn-btn">
            שריפה ✗
          </button>
        </div>

        {/* Drawer Toggle */}
        <button onClick={() => setIsDrawerOpen(true)} className="drawer-toggle">
          היסטוריה
        </button>
      </div>

      <HistoryDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        succeededCards={succeededCards}
        burnedCards={burnedCards}
      />
    </div>
  );
};