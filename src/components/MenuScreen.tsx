interface MenuScreenProps {
  onStartRound: () => void;
}

export const MenuScreen = ({ onStartRound }: MenuScreenProps) => {
  return (
    <div className="screen active">
      <div className="menu-container">
        <h1>אליאס</h1>
        <button onClick={onStartRound} className="primary-btn">
          התחל סיבוב
        </button>
      </div>
    </div>
  );
};