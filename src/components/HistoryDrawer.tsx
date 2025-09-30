interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  succeededCards: string[];
  burnedCards: string[];
}

export const HistoryDrawer = ({ isOpen, onClose, succeededCards, burnedCards }: HistoryDrawerProps) => {
  return (
    <div className={`drawer ${isOpen ? 'open' : ''}`} onClick={(e) => {
      if (e.target === e.currentTarget) onClose();
    }}>
      <div className="drawer-content">
        <div className="drawer-header">
          <h2>היסטוריית הסיבוב</h2>
          <button onClick={onClose} className="close-btn">✕</button>
        </div>
        <div className="drawer-body">
          <div className="history-section">
            <h3 className="success-title">הצלחות ✓</h3>
            <ul className="history-list success-list">
              {succeededCards.map((word, index) => (
                <li key={`success-${index}`}>{word}</li>
              ))}
            </ul>
          </div>
          <div className="history-section">
            <h3 className="burn-title">שריפות ✗</h3>
            <ul className="history-list burn-list">
              {burnedCards.map((word, index) => (
                <li key={`burn-${index}`}>{word}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};