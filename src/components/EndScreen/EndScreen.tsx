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
  const { 
    arrivedVesselsCount, 
    totalVessels, 
    resetGameState, 
    updateSavedScores, 
    currentLevel, 
    currentDifficulty 
  } = useContext(GameContext)!;

  const percentage = ((arrivedVesselsCount / totalVessels) * 100).toFixed(2);

  const handleSaveAndReset = () => {
    updateSavedScores(currentLevel.id, currentDifficulty, score, parseFloat(percentage));
    resetGameState();
  };
  
  const handleRestart = () => {
    handleSaveAndReset();
    onRestartGame();
  };

  const handleBackToHome = () => {
    handleSaveAndReset();
    onBackToHome();
  };

  return (
    <div className="end-screen">
      <h1>Well Done !</h1>
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
