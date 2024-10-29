import { Level } from "../models/level.model";
import { Vessel } from "../models/vessel.model";

export interface GameProviderProps {
  children: React.ReactNode;
}

// GAMING CONTEXT ELEMENTS
export interface GameContextProps {
  vessels: Vessel[]; 
  setVessels: React.Dispatch<React.SetStateAction<Vessel[]>>;
  currentLevel: Level; 
  setCurrentLevel: React.Dispatch<React.SetStateAction<Level>>;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  arrivedVesselsCount: number;
  setArrivedVesselsCount: React.Dispatch<React.SetStateAction<number>>;
  failedVesselsCount: number;
  setFailedVesselsCount: React.Dispatch<React.SetStateAction<number>>;
  resetGameState: () => void; 
}