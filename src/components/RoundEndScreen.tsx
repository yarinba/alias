import { useState } from 'react';
import { HistoryDrawer } from './HistoryDrawer';

interface RoundEndScreenProps {
  successCount: number;
  burnCount: number;
  succeededCards: string[];
  burnedCards: string[];
  onReturnToMenu: () => void;
}

export const RoundEndScreen = ({
  successCount,
  burnCount,
  succeededCards,
  burnedCards,
  onReturnToMenu,
}: RoundEndScreenProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <div className="screen active">
      <div className="end-container">
        <h2>הסיבוב הסתיים!</h2>
        <div className="final-score">
          <p className="score-item success">הצלחות: <span>{successCount}</span></p>
          <p className="score-item burn">שריפות: <span>{burnCount}</span></p>
        </div>
        <button onClick={onReturnToMenu} className="primary-btn">
          חזור לתפריט
        </button>

        {/* Drawer Toggle for End Screen */}
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