import React, { useContext } from 'react';

import './EndScreen.css';
import spaceshipLogoSrc from '../../assets/images/spaceshipLogo.webp';
import starLogoSrc from '../../assets/images/starLogo.webp';
import { GameContext } from '../../context/GameProvider';

interface EndScreenProps {
  score: number;
  onRestartGame: () => void;
  onBackToHome: () => void;
}

const EndScreen: React.FC<EndScreenProps> = ({ score, onRestartGame, onBackToHome }) => {
  const { arrivedVesselsCount, totalVessels, resetGameState } = useContext(GameContext)!;

  const handleRestart = () => {
    resetGameState();
    onRestartGame();
  };

  const handleBackToHome = () => {
    resetGameState();
    onBackToHome();
  };

  const percentage = ((arrivedVesselsCount / totalVessels) * 100).toFixed(2);

  return (
    <div className="end-screen">
      <h1>Partie terminée</h1>
      <div className="end-screen-stats">
        <div className="stat-item">
          <img src={spaceshipLogoSrc} alt="Vaisseau" />
          <span>{percentage} %</span>
        </div>
        <div className="stat-item">
          <img src={starLogoSrc} alt="Score" />
          <span>{score}</span>
        </div>
      </div>
      <div className="end-screen-buttons">
        <button onClick={handleRestart}>Restart</button>
        <button onClick={handleBackToHome}>Back Home</button>
      </div>
    </div>
  );
};

export default EndScreen;
