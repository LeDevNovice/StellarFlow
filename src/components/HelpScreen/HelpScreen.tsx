import React from 'react';

import vesselIcon from '../../assets/images/normalVessel.webp';
import portalIcon from '../../assets/images/portalIcon.webp';
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
            Manage the traffic of 50 spaceships between planets. Prevent collisions between them, portal and enemies and ensure as many vessels as possible reach their destinations within the time limit.
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
                  Guide your ships safely to their destinations. Monitor their paths to avoid collisions with other ships, portals or enemies.
                </p>
              </div>
            </div>

            <div className="mechanic">
              <img src={portalIcon} alt="Portal Icon" />
              <div>
                <h3>Portals</h3>
                <p>
                  Portals can alter your ship's paths. If a ship passes through a portal, it may be teleported back along its route. Use ship's invisible state to avoid them.
                </p>
              </div>
            </div>

            <div className="mechanic">
              <img src={enemyVesselIcon} alt="Enemy Vessel Icon" />
              <div>
                <h3>Enemy Ships</h3>
                <p>
                  Enemy ships pose a threat to your fleet. They move across the map and can destroy your ships upon collision. Use your ships' shot abilities to defend against them.
                </p>
              </div>
            </div>
          </div>

          <div className="right-column">
            <h2>Controls</h2>
            <div className="control">
              <p>
                <strong>Left Click:</strong> Change the speed state of a vessel (Normal, Slowed, Accelerated, Invisible).
              </p>
            </div>
            <div className="control">
              <p>
                <strong>Right Click:</strong> Use a vessel to shoot at enemy ships (Available in Hard difficulty).
              </p>
            </div>
            <h2>Difficulty Levels</h2>
            <ul>
              <li>
                <strong>Easy:</strong> Manage your 50 ships without portals or enemy ships.
              </li>
              <li>
                <strong>Medium:</strong> Portals are introduced, adding complexity to ship management.
              </li>
              <li>
                <strong>Hard:</strong> Enemy ships appear, requiring anihilations actions to protect your 50 ships.
              </li>
            </ul>

            <h2>Tips and Strategies</h2>
            <ul>
              <li>Plan your ships' paths carefully to avoid collisions by hovering over them to pause the game.</li>
              <li>Use the invisible speed state to bypass portals and other ships.</li>
              <li>Don't forget to shoot and eliminating enemy ships to protect your fleet.</li>
              <li>Switch between speed states to manage ship's path effectively.</li>
            </ul>
          </div>
        </section>
      </div>
      <button onClick={onBack}>Back to Home</button>
    </div>
  );
};

export default HelpScreen;
