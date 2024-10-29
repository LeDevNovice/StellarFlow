import React from 'react';

import vesselIcon from '../../assets/images/normalVessel.webp';
// import portalIcon from '../assets/images/portalIcon.png'; - TO-DO
import enemyVesselIcon from '../../assets/images/enemyVessel.webp';
// import leftClickIcon from '../assets/images/leftClickIcon.png'; - TO-DO
// import rightClickIcon from '../assets/images/rightClickIcon.png'; - TO-DO
import { HelpScreenProps } from './helpScreen.interface';
import './HelpScreen.css';

const HelpScreen: React.FC<HelpScreenProps> = ({ onBack }) => {
  return (
    <div className="help-screen">
      <h1>How to Play</h1>
      <div className="help-content">
        <section>
          <h2>Goals</h2>
          <p>
            Manage the traffic of spaceships between planets. Prevent collisions and ensure as many vessels as possible reach their destinations within the time limit.
          </p>
        </section>

        <section className="split-section">
          <div className="left-column">
            <h2>Gameplay Mechanics</h2>

            <div className="mechanic">
              <img src={vesselIcon} alt="Vessel Icon" />
              <div>
                <h3>Vessel Management</h3>
                <p>
                  Guide your ships safely to their destinations. Monitor their paths to avoid collisions with other ships or obstacles.
                </p>
              </div>
            </div>

            <div className="mechanic">
              {/* <img src={portalIcon} alt="Portal Icon" /> */}
              <div>
                <h3>Portals</h3>
                <p>
                  Portals can alter your ships' paths. If a ship passes through a portal, it may be teleported back along its route. Adjust your strategy to account for these anomalies.
                </p>
              </div>
            </div>

            <div className="mechanic">
              <img src={enemyVesselIcon} alt="Enemy Vessel Icon" />
              <div>
                <h3>Enemy Ships</h3>
                <p>
                  Enemy ships pose a threat to your fleet. They move across the map and can destroy your ships upon collision. Use your ships' abilities to defend against them.
                </p>
              </div>
            </div>
          </div>

          <div className="right-column">
            <h2>Controls</h2>
            <div className="control">
              {/* <img src={leftClickIcon} alt="Left Click Icon" /> */}
              <p>
                <strong>Left Click:</strong> Change the speed state of a vessel (Normal, Slowed, Accelerated, Invisible).
              </p>
            </div>
            <div className="control">
              {/* <img src={rightClickIcon} alt="Right Click Icon" /> */}
              <p>
                <strong>Right Click:</strong> Use a vessel to shoot at enemy ships (Available in Hard difficulty).
              </p>
            </div>
            <h2>Difficulty Levels</h2>
            <ul>
              <li>
                <strong>Easy:</strong> Manage your ships without portals or enemy ships.
              </li>
              <li>
                <strong>Medium:</strong> Portals are introduced, adding complexity to ship management.
              </li>
              <li>
                <strong>Hard:</strong> Enemy ships appear, requiring strategic actions to protect your fleet.
              </li>
            </ul>

            <h2>Tips and Strategies</h2>
            <ul>
              <li>Plan your ships' paths carefully to avoid collisions.</li>
              <li>Monitor portals and adjust your strategy accordingly.</li>
              <li>Use the invisible speed state to bypass obstacles.</li>
              <li>Prioritize eliminating enemy ships to protect your fleet.</li>
              <li>Utilize speed states to manage ships effectively.</li>
            </ul>
          </div>
        </section>
      </div>
      <button onClick={onBack}>Back to Home</button>
    </div>
  );
};

export default HelpScreen;
