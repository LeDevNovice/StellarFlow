import React from 'react';

import { DifficultySelectorProps } from './difficultySelector.interface';
import './DifficultySelector.css';

const DifficultySelector: React.FC<DifficultySelectorProps> = ({ onSelectDifficulty }) => {
  return (
    <div className="difficulty-selector">
      <h2>Select Difficulty</h2>
      <div className="difficulty-buttons">
        <button onClick={() => onSelectDifficulty(1)}>Easy</button>
        <button onClick={() => onSelectDifficulty(2)}>Medium</button>
        <button onClick={() => onSelectDifficulty(3)}>Hard</button>
      </div>
    </div>
  );
};

export default DifficultySelector;
