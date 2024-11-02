import { Level } from "../models/level.model";
import { Vessel } from "../models/vessel.model";

export interface GameProviderProps {
  children: React.ReactNode;
}

export interface LevelScore {
  score: number;
  percentage: number;
}

export interface Scores {
  [levelId: number]: {
    [difficulty: number]: LevelScore;
  };
}

// GAMING CONTEXT ELEMENTS
export interface GameContextProps {
  vessels: Vessel[]; 
  setVessels: React.Dispatch<React.SetStateAction<Vessel[]>>;
  currentLevel: Level; 
  setCurrentLevel: React.Dispatch<React.SetStateAction<Level>>;
  currentDifficulty: number;
  setCurrentDifficulty: (difficulty: number) => void;
  score: number;
  setScore: React.Dispatch<React.SetStateAction<number>>;
  arrivedVesselsCount: number;
  setArrivedVesselsCount: React.Dispatch<React.SetStateAction<number>>;
  failedVesselsCount: number;
  setFailedVesselsCount: React.Dispatch<React.SetStateAction<number>>;
  totalVessels: number;
  setTotalVessels: React.Dispatch<React.SetStateAction<number>>;
  gameState: 'playing' | 'completed';
  setGameState: React.Dispatch<React.SetStateAction<'playing' | 'completed'>>;
  resetGameState: () => void; 
  savedScores: Scores;
  updateSavedScores: (
    levelId: number,
    difficulty: number,
    score: number,
    percentage: number
  ) => void;
}