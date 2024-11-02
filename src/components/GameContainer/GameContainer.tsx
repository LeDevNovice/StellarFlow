import { useContext, useEffect } from 'react';

import GameCanvas from '../GameCanvas/GameCanvas';
import EndScreen from '../EndScreen/EndScreen';
import { GameContext } from '../../context/GameProvider';
import { GameContainerProps } from './gameContainer.interface';
import './GameContainer.css';

import backIcon from '../../assets/images/backIcon.webp';

function GameContainer({ level, difficulty, onBackToHome, onRestartGame }: GameContainerProps) {
  const { setCurrentLevel, setCurrentDifficulty, gameState, score } = useContext(GameContext)!;

  useEffect(() => {
    setCurrentLevel(level);
    setCurrentDifficulty(difficulty);
  }, [level, difficulty, setCurrentLevel, setCurrentDifficulty]);

  return (
    <div className="App">
      {gameState === 'completed' ? (
        <EndScreen
          score={score}
          onRestartGame={onRestartGame}
          onBackToHome={onBackToHome}
        />
      ) : (
        <>
          <GameCanvas />
          <button className="back-button" onClick={onBackToHome}>
            <img src={backIcon} alt="Back to Home" />
          </button>
        </>
      )}
    </div>
  );
}

export default GameContainer;
