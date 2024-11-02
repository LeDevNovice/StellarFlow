
import { createContext, useEffect, useState } from "react";

import { GameContextProps, GameProviderProps, Scores } from "./GameProvider.interface";
import { levels } from "../level/level";
import { Level } from "../models/level.model";
import { Vessel } from "../models/vessel.model";
import { VESSEL_PER_LEVEL } from "../utils/constants";

export const GameContext = createContext<GameContextProps | undefined>(undefined); // need to change that for fast refresh ?

export const GameProvider = ({ children }: GameProviderProps) => {
  const [vessels, setVessels] = useState<Vessel[]>([]);
  const [currentLevel, setCurrentLevel] = useState<Level>(levels[0]);
  const [currentDifficulty, setCurrentDifficulty] = useState<number>(1);
  const [score, setScore] = useState(0);
  const [totalVessels, setTotalVessels] = useState(VESSEL_PER_LEVEL);
  const [arrivedVesselsCount, setArrivedVesselsCount] = useState(0);
  const [failedVesselsCount, setFailedVesselsCount] = useState(0);
  const [gameState, setGameState] = useState<'playing' | 'completed'>('playing');
  const [savedScores, setSavedScores] = useState<Scores>({});

  const resetGameState = () => {
    setVessels([]);
    setScore(0);
    setArrivedVesselsCount(0);
    setFailedVesselsCount(0);
    setGameState('playing');
  };

    useEffect(() => {
      const savedScoresFromStorage = localStorage.getItem('savedScores');
      if (savedScoresFromStorage) {
        setSavedScores(JSON.parse(savedScoresFromStorage));
      }
    }, []);
  
    const updateSavedScores = (levelId: number, difficulty: number, score: number, percentage: number) => {
      setSavedScores((prevScores) => {
        const updatedScores = { ...prevScores };
        if (!updatedScores[levelId]) {
          updatedScores[levelId] = {};
        }
    
        const existingScore = updatedScores[levelId][difficulty];
    
        if (existingScore) {
          const existingPercentage = existingScore.percentage;
          const existingScoreValue = existingScore.score;
    
          if (
            percentage > existingPercentage ||
            (percentage === existingPercentage && score > existingScoreValue)
          ) {
            updatedScores[levelId][difficulty] = { score, percentage };
          }
        } else {
          updatedScores[levelId][difficulty] = { score, percentage };
        }
        
        localStorage.setItem('savedScores', JSON.stringify(updatedScores));
    
        return updatedScores;
      });
    };

  return (
    <GameContext.Provider
      value={{
        vessels,
        setVessels,
        currentLevel,
        setCurrentLevel,
        currentDifficulty,
        setCurrentDifficulty,
        score,
        setScore,
        totalVessels,
        setTotalVessels,
        arrivedVesselsCount,
        setArrivedVesselsCount,
        failedVesselsCount,
        setFailedVesselsCount,
        gameState,
        setGameState,
        resetGameState,
        savedScores,
        updateSavedScores,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};
