import { useContext, useEffect } from 'react';

import GameCanvas from '../GameCanvas/GameCanvas';
import EndScreen from '../EndScreen/EndScreen';
import { GameContext } from '../../context/GameProvider';
import { GameContainerProps } from './gameContainer.interface';
import './GameContainer.css';

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
          <button className="quit-button" onClick={onBackToHome}>Quit</button>
        </>
      )}
    </div>
  );
}

export default GameContainer;
