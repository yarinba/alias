import { useState } from 'react';
import { Card } from './Card';
import { HistoryDrawer } from './HistoryDrawer';

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
          <button onClick={onSuccess} className="action-btn success-btn">
            הצלחה ✓
          </button>
          <button onClick={onBurn} className="action-btn burn-btn">
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