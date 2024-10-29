
import { createContext, useState } from "react";

import { GameContextProps, GameProviderProps } from "./GameProvider.interface";
import { levels } from "../level/level";
import { Level } from "../models/level.model";
import { Vessel } from "../models/vessel.model";

export const GameContext = createContext<GameContextProps | undefined>(undefined); // need to change that for fast refresh ?

export const GameProvider = ({ children }: GameProviderProps) => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);
  const [score, setScore] = useState(0);
  const [arrivedVesselsCount, setArrivedVesselsCount] = useState(0);
  const [failedVesselsCount, setFailedVesselsCount] = useState(0);

  const resetGameState = () => {
    setVessels([]);
    setScore(0);
    setArrivedVesselsCount(0);
    setFailedVesselsCount(0);
  };

  return (
    <GameContext.Provider
      value={{
        vessels,
        setVessels,
        currentLevel,
        setCurrentLevel,
        score,
        setScore,
        arrivedVesselsCount,
        setArrivedVesselsCount,
        failedVesselsCount,
        setFailedVesselsCount,
        resetGameState
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
