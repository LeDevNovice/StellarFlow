import { useContext, useState } from "react";

import GameCanvas from "../GameCanvas/GameCanvas";
import LevelSelector from "../LevelSelector/LevelSelector";
import { Level } from "../../models/level.model";
import { GameContext } from "../../context/GameProvider";

function GameContainer() {
  const [gameStarted, setGameStarted] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null);

  const { setCurrentLevel, setGameState } = useContext(GameContext)!;
  
  const handleLevelSelect = (level: Level) => {
    setSelectedLevel(level);
    setCurrentLevel(level);
    setGameStarted(true);
    setGameState('playing');
  };

  return (
    <div className="App">
      {!gameStarted ? (
        !selectedLevel ? (
          <LevelSelector onSelectLevel={handleLevelSelect} />
        ) : null
      ) : (
        <>
          <GameCanvas />
        </>
      )}
    </div>
  );
}

export default GameContainer;
