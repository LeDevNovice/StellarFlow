
import { createContext, useState } from "react";

import { GameContextProps, GameProviderProps } from "./GameProvider.interface";
import { levels } from "../level/level";
import { Level } from "../models/level.model";

export const GameContext = createContext<GameContextProps | undefined>(undefined); // need to change that for fast refresh ?

export const GameProvider = ({ children }: GameProviderProps) => {
  const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);

  return (
    <GameContext.Provider
      value={{
        currentLevel,
        setCurrentLevel,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
