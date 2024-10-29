import React, { useState } from 'react';

import { Level } from '../../models/level.model';
import { levels } from '../../level/level';
import './LevelSelection.css';

interface LevelSelectionProps {
  onStartGame: (level: Level, difficulty: number) => void;
}

const LevelSelection: React.FC<LevelSelectionProps> = ({ onStartGame }) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<{ [key: number]: number }>({});

  const difficulties = ['Easy', 'Medium', 'Hard'];

  const handleDifficultyChange = (levelId: number, direction: 'left' | 'right') => {
    setSelectedDifficulty((prev) => {
      const currentDifficulty = prev[levelId] || 0;
      let newDifficultyIndex = currentDifficulty;

      if (direction === 'left') {
        newDifficultyIndex = (currentDifficulty - 1 + difficulties.length) % difficulties.length;
      } else {
        newDifficultyIndex = (currentDifficulty + 1) % difficulties.length;
      }

      return { ...prev, [levelId]: newDifficultyIndex };
    });
  };

  return (
    <div className="level-selection">
      <h2>Select Your Level</h2>
      <div className="level-cards">
        {levels.map((level: Level) => {
          const difficultyIndex = selectedDifficulty[level.id] || 0;
          return (
            <div key={level.id} className="level-card">
              <h3 className="level-title">{level.name}</h3>
              <div className="level-thumbnail">
                {/* Représentation des planètes */}
                <svg width="100%" height="100%">
                  {level.planets.map((planet) => (
                    <circle
                      key={planet.id}
                      cx={`${planet.position.x * 100}%`}
                      cy={`${planet.position.y * 100}%`}
                      r="5"
                      fill="#ccc"
                    />
                  ))}
                </svg>
              </div>
              <div className="difficulty-selector">
                <button onClick={() => handleDifficultyChange(level.id, 'left')}>&lt;</button>
                <span>{difficulties[difficultyIndex]}</span>
                <button onClick={() => handleDifficultyChange(level.id, 'right')}>&gt;</button>
              </div>
              <button
                className="play-button"
                onClick={() => onStartGame(level, difficultyIndex + 1)}
              >
                Play
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default LevelSelection;
