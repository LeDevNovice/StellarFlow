import { Level } from "../models/level.model";

export interface GameProviderProps {
  children: React.ReactNode;
}

// GAMING CONTEXT ELEMENTS
export interface GameContextProps {
  currentLevel: Level; // The current level selected
  setCurrentLevel: React.Dispatch<React.SetStateAction<Level>>; // Allow to change the value of the current level selected
}