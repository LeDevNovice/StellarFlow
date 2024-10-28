
import { createContext } from "react";

import { GameProviderProps } from "./GameProvider.interface";

export const GameContext = createContext<GameContextProps | undefined>(undefined);

export const GameProvider = ({ children }: GameProviderProps) => {
  return (
    <GameContext.Provider
      value={{}}
    >
      {children}
    </GameContext.Provider>
  );
};
