import { useContext, useState } from "react";

import GameCanvas from "../GameCanvas/GameCanvas";
import LevelSelector from "../LevelSelector/LevelSelector";
import EndScreen from "../EndScreen/EndScreen";
import { Level } from "../../models/level.model";
import { GameContext } from "../../context/GameProvider";
import { GameContainerProps } from "./gameContainer.interface";
import DifficultySelector from "../DifficultySelector/DifficultySelector";

function GameContainer({ onBackToHome, onRestartGame }: GameContainerProps) {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<number>(0);

  const { gameState, score, setCurrentLevel, setCurrentDifficulty, setGameState } = useContext(GameContext)!;
  
  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
  };

  const handleDifficultySelect = (difficulty: number) => {
    setSelectedDifficulty(difficulty);
    setCurrentLevel(selectedLevel!);
    setCurrentDifficulty(difficulty);
    setGameStarted(true);
    setGameState('playing');
  };

  return (
    <div className="App">
      {!gameStarted ? (
        !selectedLevel ? (
          <LevelSelector onSelectLevel={handleLevelSelect} />
        ) : !selectedDifficulty ? (
          <DifficultySelector onSelectDifficulty={handleDifficultySelect} />
        ) : null
      ) : gameState === 'completed' ? (
        <EndScreen
          score={score}
          onRestartGame={onRestartGame}
          onBackToHome={onBackToHome}
        />
      ) : (
        <>
          <GameCanvas />
        </>
      )}
    </div>
  );
}

export default GameContainer;
