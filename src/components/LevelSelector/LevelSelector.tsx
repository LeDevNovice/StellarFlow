import { Level } from '../../models/level.model';
import { levels } from '../../level/level';
import { LevelSelectorProps } from './levelSelector.interface';
import './LevelSelector.css';

const LevelSelector: React.FC<LevelSelectorProps> = ({ onSelectLevel }) => {
  return (
    <div className="level-selector">
      <h2>Select a Level</h2> 
      <ul className="level-list">
        {levels.map((level: Level) => (
          <li key={level.id} className="level-item">
            <button onClick={() => onSelectLevel(level)} className="level-button">
              <div className="level-thumbnail">
                {/* Render planet formation design */}
                <svg width="100" height="100">
                  {level.planets.map((planet) => (
                    <circle
                      key={planet.id}
                      cx={planet.position.x * 100}
                      cy={planet.position.y * 100}
                      r="8"
                      fill="#fff"
                    />
                  ))}
                </svg>
              </div>
              <span className="level-name">{level.name}</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LevelSelector;
