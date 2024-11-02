import { useContext, useEffect, useRef, useState } from "react";

import { GameContext } from "../../context/GameProvider";
import soundManager from "../../utils/soundManager";
import { 
  planetImage,
  starLogoImage,
  percentageLogoImage,
  spaceshipLogoImage,
  enemyVesselImage, 
  getVesselImage 
} from "../../utils/loadImage";

import { Effect } from "../../models/effect.model";
import { FloatingText } from "../../models/floatingText.model";
import { Level } from "../../models/level.model";
import { Planet } from "../../models/planet.model";
import { Point } from "../../models/point.model";
import { Vessel } from "../../models/vessel.model";
import { Portal } from "../../models/portal.model";
import { EnemyVessel } from '../../models/enemy.model';
import { Shot } from "../../models/shot.model";
import { calculateDistance } from "../../utils/calculateDistance";
import { calculateDirection } from "../../utils/calculateDirection";
import { getRandomFactor } from "../../utils/getRandomFactor";
import { checkCollision, checkCollisionBetweenVessels, checkVesselPortalCollision } from "../../utils/checkCollision";
import { 
  ANIMATION_SPEED, 
  DESTINATION_RADIUS, 
  MAX_TRAIL_LENGTH, 
  TOTAL_FRAMES, 
  VELOCITY_COLORS, 
  VESSEL_CLICK_RADIUS, 
  VESSEL_PER_LEVEL} 
from "../../utils/constants";

const GameCanvas = () => {
  const { 
    vessels: contextVessels, 
    setVessels, 
    currentLevel,
    currentDifficulty, 
    score, 
    setScore,
    failedVesselsCount, 
    setFailedVesselsCount,
    arrivedVesselsCount, 
    setArrivedVesselsCount,
    totalVessels,
    setGameState
  } = useContext(GameContext)!;

  const [isPaused, setIsPaused] = useState(false);
  const [hoveredVessel, setHoveredVessel] = useState<Vessel | null>(null);
  const [isHoveringVessel, setIsHoveringVessel] = useState(false);
  const [, setPortals] = useState<Portal[]>([]);
  const [, setEnemyVessels] = useState<EnemyVessel[]>([]);
  const [, setShots] = useState<Shot[]>([]);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vesselsRef = useRef<Vessel[]>([]);
  const vesselsGenerated = useRef(0);
  const clickEffectsRef = useRef<Effect[]>([]);
  const successEffectsRef = useRef<Effect[]>([]);
  const failureEffectsRef = useRef<Effect[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const scoreRef = useRef(score);
  const failedVesselsCountRef = useRef(failedVesselsCount);
  const portalsRef = useRef<Portal[]>([]);
  const enemyVesselsRef = useRef<EnemyVessel[]>([]);
  const shotsRef = useRef<Shot[]>([]);
  const pendingShotRef = useRef<Shot | null>(null);

  // HANDLE USER EVENTS METHODS
  const handleMouseMove = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    
    if (canvas) {
      const rect = canvas.getBoundingClientRect();
      const mouseX = event.clientX - rect.left;
      const mouseY = event.clientY - rect.top;
  
      let vesselUnderMouse: Vessel | null = null;
  
      vesselsRef.current.forEach((vessel: Vessel) => {
        if (!vessel.isArrived) {
          const distanceToVessel = calculateDistance(vessel.position, { x: mouseX, y: mouseY });
          if (distanceToVessel < VESSEL_CLICK_RADIUS) {
            vesselUnderMouse = vessel;
          }
        }
      });
  
      if (vesselUnderMouse) {
        if ((hoveredVessel as Vessel)?.id !== (vesselUnderMouse as Vessel).id) {
          setHoveredVessel(vesselUnderMouse);
          setIsPaused(true);
          setIsHoveringVessel(true);
        }
      } else {
        if (hoveredVessel) {
          setHoveredVessel(null);
          setIsPaused(false);
          setIsHoveringVessel(false);
        }
      }
    }
  };

  const handleCanvasClick = () => {
    if (hoveredVessel) {
      if (hoveredVessel.invisibilityTimeoutId) {
        clearTimeout(hoveredVessel.invisibilityTimeoutId);
        hoveredVessel.invisibilityTimeoutId = undefined;
      }
  
      switch (hoveredVessel.speedState) {
        case 'normal':
          hoveredVessel.speedState = 'slowed';
          break;
        case 'slowed':
          hoveredVessel.speedState = 'accelerated';
          break;
        case 'accelerated':
          hoveredVessel.speedState = 'invisible';
          // eslint-disable-next-line no-case-declarations
          const timeoutId = window.setTimeout(() => {
            hoveredVessel.speedState = 'normal';
            setVessels([...vesselsRef.current]);
            hoveredVessel.invisibilityTimeoutId = undefined;
          }, 5000);
          hoveredVessel.invisibilityTimeoutId = timeoutId;
          break;
        case 'invisible':
          hoveredVessel.speedState = 'normal';
          break;
        default:
          hoveredVessel.speedState = 'normal';
      }
  
      setVessels([...vesselsRef.current]);
      createClickEffect(hoveredVessel.position);
    }
  };

  const handleCanvasContextMenu = (event: React.MouseEvent<HTMLCanvasElement>) => {
    event.preventDefault();
  
    if (hoveredVessel) {
      prepareShotFromVessel(hoveredVessel);
      soundManager.shot.play();
    }
  };

  const createVessel = (id: number, startPosition: Point, destination: Point): Vessel => {
    const velocity = Math.random() * (30.0 - 10.0) + 10.0 + 1.2;
    const direction = calculateDirection(startPosition, destination);
    const totalDistance = calculateDistance(startPosition, destination);
    const TIME_FACTOR = getRandomFactor();
    const totalTime = (totalDistance / velocity) * TIME_FACTOR;
    const timeRemaining = totalTime;

    return {
      id,
      position: startPosition,
      velocity,
      direction,
      destination,
      isSlowed: false,
      isArrived: false,
      timeRemaining,
      totalTime,
      path: [],
      animationFrame: 0,
      speedState: 'normal',
    };
  };

  const createPortal = () => {
    if (vesselsRef.current.length === 0) return;

    // Choose a random vessel
    const randomVesselIndex = Math.floor(Math.random() * vesselsRef.current.length);
    const vessel = vesselsRef.current[randomVesselIndex];

    let t;
    let position;
    let distanceToStart;
    let distanceToEnd;

    const planetRadius = 25;    
    const portalMaxRadius = 10;  
    const buffer = 20;
    const minDistance = planetRadius + portalMaxRadius + buffer;

    const maxAttempts = 10;
    let attempts = 0;

    do {
      t = Math.random() * 0.8 + 0.1;

      position = {
        x: vessel.position.x + t * (vessel.destination.x - vessel.position.x),
        y: vessel.position.y + t * (vessel.destination.y - vessel.position.y),
      };

      distanceToStart = calculateDistance(position, vessel.position);
      distanceToEnd = calculateDistance(position, vessel.destination);

      attempts++;
      if (attempts >= maxAttempts) {
        // If a suitable position isn't found, exit to prevent infinite loop
        return;
      }
    } while (
      distanceToStart < minDistance ||
      distanceToEnd < minDistance
    );

    const portal: Portal = {
      id: Date.now() + Math.random(),
      position,
      radius: 0,
      maxRadius: portalMaxRadius,
      isActive: true,
    };

    portalsRef.current.push(portal);
    setPortals([...portalsRef.current]);
  };

  const createEnemyVessel = () => {
    const id = Date.now() + Math.random();
  
    // Select departure and destination planets randomly
    const level = currentLevel;
    const departurePlanet = level.planets[Math.floor(Math.random() * level.planets.length)];
    let destinationPlanet = level.planets[Math.floor(Math.random() * level.planets.length)];
  
    // Ensure they are different
    while (departurePlanet.id === destinationPlanet.id && level.planets.length > 1) {
      destinationPlanet = level.planets[Math.floor(Math.random() * level.planets.length)];
    }
  
    const canvas = canvasRef.current;
    if (!canvas) return;
  
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
  
    // Convert relative positions to absolute positions
    const startPosition = {
      x: departurePlanet.position.x * canvasWidth,
      y: departurePlanet.position.y * canvasHeight,
    };
    const destination = {
      x: destinationPlanet.position.x * canvasWidth,
      y: destinationPlanet.position.y * canvasHeight,
    };
  
    const velocity = Math.random() * (50 - 30) + 30; // Faster than player's vessels
    const direction = calculateDirection(startPosition, destination);
  
    const enemyVessel: EnemyVessel = {
      id,
      position: startPosition,
      velocity,
      direction,
      destination,
      isDestroyed: false,
      path: [],
      animationFrame: 0,
    };
  
    enemyVesselsRef.current.push(enemyVessel);
    setEnemyVessels([...enemyVesselsRef.current]);
  };

  const createClickEffect = (position: Point) => {
    const effect = {
      position: { ...position },
      radius: 0,
      maxRadius: 15,
      alpha: 1,
    };
    clickEffectsRef.current.push(effect);
  };

  const createSuccessEffect = (position: Point) => {
    const effect: Effect = {
      position: { ...position },
      radius: 0,
      alpha: 1,
    };
    successEffectsRef.current.push(effect);
  };

  const createFailureEffect = (position: Point) => {
    const effect: Effect = {
      position: { ...position },
      radius: 0,
      alpha: 1,
    };
    failureEffectsRef.current.push(effect);
  };  

  const createFloatingText = (position: Point, text: string, color: string) => {
    const floatingText = {
      position: { ...position },
      text,
      color,
      alpha: 1,
      lifespan: 1,
    };
    floatingTextsRef.current.push(floatingText);
  };

  const handleVesselSuccess = (vessel: Vessel) => {
    if (vessel.invisibilityTimeoutId) {
      clearTimeout(vessel.invisibilityTimeoutId);
      vessel.invisibilityTimeoutId = undefined;
    }

    setScore((prevScore) => prevScore + 100);
    createFloatingText(vessel.position, '+100', '#00ff00');
    createSuccessEffect(vessel.position);

    setArrivedVesselsCount((prev) => prev + 1);

    soundManager.vesselArrived.play();
  };

  const handleVesselFailure = (vessel: Vessel) => {
    if (vessel.invisibilityTimeoutId) {
      clearTimeout(vessel.invisibilityTimeoutId);
      vessel.invisibilityTimeoutId = undefined;
    }

    setScore((prevScore) => prevScore - 50);
    createFloatingText(vessel.position, '-50', '#ff0000');
    createFailureEffect(vessel.position);

    setFailedVesselsCount((prev) => prev + 1);

    soundManager.vesselFailure.play();
  };

  const handleCollisions = () => {
    const collidedVesselIds = new Set<number>();
    const collidedVessels: Vessel[] = [];
  
    for (let i = 0; i < vesselsRef.current.length; i++) {
      for (let j = i + 1; j < vesselsRef.current.length; j++) {
        const vesselA: Vessel = vesselsRef.current[i];
        const vesselB: Vessel = vesselsRef.current[j];

        // Check if one of the vessels is in invisible state
        if (
          vesselA.speedState === 'invisible' ||
          vesselB.speedState === 'invisible'
        ) {
          continue;
        }
  
        // If the two vessels are not arrived, check collision
        if (
          !vesselA.isArrived &&
          !vesselB.isArrived &&
          checkCollision(vesselA, vesselB)
        ) {
          collidedVesselIds.add(vesselA.id);
          collidedVesselIds.add(vesselB.id);
          collidedVessels.push(vesselA, vesselB);
        }
      }
    }
  
    if (collidedVesselIds.size > 0) {
      // Keep the vessels that are not collided
      const remainingVessels = vesselsRef.current.filter(
        (vessel: Vessel) => !collidedVesselIds.has(vessel.id)
      );
  
      // Update vessels
      vesselsRef.current = remainingVessels;
      setVessels([...vesselsRef.current]);

      const collisionCount = collidedVesselIds.size / 2;
      const penalty = collisionCount * 100;
  
      setScore((prevScore) => prevScore - penalty);

      collidedVessels.forEach((vessel: Vessel) => {
        createFloatingText(vessel.position, '-50', '#ff0000');
        createFailureEffect(vessel.position);
        setFailedVesselsCount((prev) => prev + 1);

        soundManager.collision.play();
      });
    }
  };
  
  const handleVesselPortalCollision = (vessel: Vessel, portal: Portal) => {
    const pathLength = vessel.path.length;

    if (pathLength > 0) {
      const randomIndex = Math.floor(Math.random() * pathLength);

      vessel.position = { ...vessel.path[randomIndex] };
      vessel.path = vessel.path.slice(0, randomIndex + 1);
      vessel.direction = calculateDirection(vessel.position, vessel.destination);

      const distanceToDestination = calculateDistance(vessel.position, vessel.destination);
      vessel.timeRemaining = distanceToDestination / vessel.velocity;

      createFloatingText(vessel.position, 'PFFUIT !', '#800080');

      portal.isActive = false;
      setPortals([...portalsRef.current]);

      soundManager.bounce.play();
    }
  };

  const prepareShotFromVessel = (vessel: Vessel) => {
    const shot: Shot = {
      id: Date.now() + Math.random(),
      position: { ...vessel.position },
      velocity: 100,
      direction: { ...vessel.direction },
      destination: { ...vessel.destination },
      isActive: false,
    };
    pendingShotRef.current = shot;
  };

    useEffect(() => {
      vesselsGenerated.current = 0;
      clickEffectsRef.current = [];
      successEffectsRef.current = [];
      failureEffectsRef.current = [];
      floatingTextsRef.current = [];
      portalsRef.current = [];
      enemyVesselsRef.current = [];
      shotsRef.current = [];
      pendingShotRef.current = null;
    }, [currentLevel, currentDifficulty]);

    useEffect(() => {
        vesselsRef.current = contextVessels;
    }, [contextVessels]);

    useEffect(() => {
      scoreRef.current = score;
    }, [score]);

    useEffect(() => {
      failedVesselsCountRef.current = failedVesselsCount;
    }, [failedVesselsCount]);

    useEffect(() => {
      if (arrivedVesselsCount + failedVesselsCount >= totalVessels) {
        setGameState('completed');
      }
    }, [arrivedVesselsCount, failedVesselsCount, totalVessels, setGameState]);
    
    useEffect(() => {
      const canvas = canvasRef.current;

      if (canvas) {
        canvas.style.cursor = isHoveringVessel ? 'pointer' : 'default';
      }
    }, [isHoveringVessel]);

    useEffect(() => {
      if (currentDifficulty >= 2) {
        const portalGenerationInterval = setInterval(() => {
          if (!isPaused) {
            createPortal();
          }
        }, 10000);
  
        return () => clearInterval(portalGenerationInterval);
      }
    }, [isPaused, currentDifficulty]);

    useEffect(() => {
      if (currentDifficulty >= 3) {
        const enemyGenerationInterval = setInterval(() => {
          if (!isPaused) {
            createEnemyVessel();
          }
        }, 10000);
  
        return () => clearInterval(enemyGenerationInterval);
      }
    }, [isPaused, currentDifficulty]);

    useEffect(() => {
      if (!isPaused && pendingShotRef.current) {
        const shot = pendingShotRef.current;
        shot.isActive = true;
        shotsRef.current.push(shot);
        setShots([...shotsRef.current]);
        pendingShotRef.current = null;
      }
    }, [isPaused]);

    // GENERATE VESSEL
    useEffect(() => {
        if (vesselsGenerated.current < VESSEL_PER_LEVEL && !isPaused) {
            const generateVesselForLevel = (level: Level) => {
            const id = Date.now() + Math.random();

            // Select a departure planet and a different destination planet
            const departurePlanet = level.planets[Math.floor(Math.random() * level.planets.length)];
            let destinationPlanet = level.planets[Math.floor(Math.random() * level.planets.length)];

            while (departurePlanet.id === destinationPlanet.id && level.planets.length > 1) {
                destinationPlanet = level.planets[Math.floor(Math.random() * level.planets.length)];
            }

            const canvas = canvasRef.current;
            if (!canvas) return; // Ensure canvas is available

            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;

            // Convert relative positions to absolute positions
            const startPosition = {
                x: departurePlanet.position.x * canvasWidth,
                y: departurePlanet.position.y * canvasHeight,
            };
            const destination = {
                x: destinationPlanet.position.x * canvasWidth,
                y: destinationPlanet.position.y * canvasHeight,
            };

            const vessel = createVessel(id, startPosition, destination);

            vesselsRef.current.push(vessel);
            setVessels([...vesselsRef.current]);
            };

            const vesselGenerationInterval = setInterval(() => {
            if (vesselsGenerated.current < VESSEL_PER_LEVEL && !isPaused) {
                generateVesselForLevel(currentLevel);
                vesselsGenerated.current += 1;
            } else {
                clearInterval(vesselGenerationInterval);
            }
            }, 4000);

            return () => {
            clearInterval(vesselGenerationInterval);
            };
        }
    }, [currentLevel, VESSEL_PER_LEVEL, setVessels, isPaused]);

    const handleEnemyPlayerCollision = (playerVessel: Vessel) => {
      playerVessel.isArrived = true; // Destroy the player vessel
      setFailedVesselsCount((prev) => prev + 1);
      setScore((prevScore) => prevScore - 50);
      createFloatingText(playerVessel.position, '-50', '#ff0000');

      soundManager.collision.play();
    };

  useEffect(() => {
    const canvas = canvasRef.current;

    if (canvas) {
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
    
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    
        const context = canvas.getContext('2d');

        if (context) {
          let animationFrameId: number;
          let lastTime = performance.now();

          const update = () => {
            const now = performance.now();
            const deltaTime = (now - lastTime) / 1000;
            lastTime = now;

            // UPDATE VESSELS
            vesselsRef.current.forEach((vessel) => {
                if (!vessel.isArrived) {
                let actualVelocity = vessel.velocity;
                if (vessel.speedState === 'slowed') {
                    actualVelocity /= 2; // Reduce half the speed
                } else if (vessel.speedState === 'accelerated') {
                    actualVelocity *= 2; // Increase half the speed
                }

                // UPDATE VESSEL POSITION
                vessel.position.x += vessel.direction.x * actualVelocity * deltaTime;
                vessel.position.y += vessel.direction.y * actualVelocity * deltaTime;

                vessel.timeRemaining -= deltaTime;
                if (vessel.timeRemaining <= 0) {
                    vessel.isArrived = true;
                    handleVesselFailure(vessel);
                }

                const distanceToDestination = calculateDistance(vessel.position, vessel.destination);
                if (distanceToDestination <= DESTINATION_RADIUS) {
                    vessel.isArrived = true;
                    handleVesselSuccess(vessel);
                }

                vessel.path.push({ x: vessel.position.x, y: vessel.position.y });
                if (vessel.path.length > MAX_TRAIL_LENGTH) {
                    vessel.path.shift();
                }

                vessel.animationFrame += deltaTime * ANIMATION_SPEED;
                if (vessel.animationFrame >= TOTAL_FRAMES) {
                    vessel.animationFrame = 0;
                }
                }
            });

            // CHECK COLLISION BETWEEN VESSELS AND PORTALS
            vesselsRef.current.forEach((vessel) => {
              if (vessel.isArrived || vessel.speedState === 'invisible') return;

              portalsRef.current.forEach((portal) => {
                if (portal.isActive && checkVesselPortalCollision(vessel, portal)) {
                  handleVesselPortalCollision(vessel, portal);
                }
              });
            });

            // UPDATE CLICK EFFECTS
            clickEffectsRef.current = clickEffectsRef.current.filter((effect) => {
              effect.radius += 50 * deltaTime;
              effect.alpha -= deltaTime * 2;
              return effect.alpha > 0;
            });

            handleCollisions();

            // UPDATE SUCCESS EFFECTS
            successEffectsRef.current = successEffectsRef.current.filter((effect) => {
              effect.radius += 50 * deltaTime;
              effect.alpha -= deltaTime * 2;
              return effect.alpha > 0;
            });

            // UPDATE FAILURE EFFECTS
            failureEffectsRef.current = failureEffectsRef.current.filter((effect) => {
              effect.radius += 50 * deltaTime;
              effect.alpha -= deltaTime * 2;
              return effect.alpha > 0;
            });

            // UPDATE FLOATING TEXTS
            floatingTextsRef.current = floatingTextsRef.current.filter((text: FloatingText) => {
              text.alpha -= deltaTime / text.lifespan;
              text.position.y -= 20 * deltaTime;
              return text.alpha > 0;
            });

            // UPDATE PORTALS
            if (currentDifficulty >= 2) {
              portalsRef.current = portalsRef.current.filter((portal) => {
                if (portal.radius < portal.maxRadius) {
                  portal.radius += 10 * deltaTime;
                } else {
                  portal.radius = portal.maxRadius;
                }
                return portal.isActive;
              });
            }

            enemyVesselsRef.current.forEach((enemyVessel) => {
              if (enemyVessel.isDestroyed) return;
  
              vesselsRef.current.forEach((playerVessel) => {
                if (playerVessel.isArrived) return;
  
                if (checkCollisionBetweenVessels(enemyVessel, playerVessel)) {
                  // Handle collision
                  handleEnemyPlayerCollision(playerVessel);
                }
              });
            });

            if (currentDifficulty >= 3) {
              enemyVesselsRef.current.forEach((enemyVessel) => {
                if (!enemyVessel.isDestroyed) {
                  enemyVessel.position.x += enemyVessel.direction.x * enemyVessel.velocity * deltaTime;
                  enemyVessel.position.y += enemyVessel.direction.y * enemyVessel.velocity * deltaTime;
    
                  enemyVessel.path.push({ x: enemyVessel.position.x, y: enemyVessel.position.y });
                  if (enemyVessel.path.length > MAX_TRAIL_LENGTH) {
                    enemyVessel.path.shift();
                  }
    
                  const distanceToDestination = calculateDistance(enemyVessel.position, enemyVessel.destination);
                  if (distanceToDestination <= DESTINATION_RADIUS) {
                    enemyVessel.isDestroyed = true;
                  }
                }
              });
            }

            shotsRef.current = shotsRef.current.filter((shot) => shot.isActive);

            shotsRef.current.forEach((shot) => {
              shot.position.x += shot.direction.x * shot.velocity * deltaTime;
              shot.position.y += shot.direction.y * shot.velocity * deltaTime;
  
              enemyVesselsRef.current.forEach((enemyVessel) => {
                if (enemyVessel.isDestroyed) return;
  
                if (checkCollisionBetweenVessels(shot, enemyVessel)) {
                  enemyVessel.isDestroyed = true;
                  setScore((prevScore) => prevScore + 100);
                  createFloatingText(enemyVessel.position, '+100', '#00ff00');

                  shot.isActive = false;
                }
              });
  
              const distanceToDestination = calculateDistance(shot.position, shot.destination);
              if (distanceToDestination <= DESTINATION_RADIUS) {
                shot.isActive = false;
              }
  
              if (
                shot.position.x < 0 || shot.position.x > canvas.width ||
                shot.position.y < 0 || shot.position.y > canvas.height
              ) {
                shot.isActive = false;
              }
            });
  
            setShots([...shotsRef.current]);
          }

          // DRAWING ON CANVAS METHOD
          const draw = () => {
            context.clearRect(0, 0, canvas.width, canvas.height);
            const totalVesselsCount = vesselsGenerated.current; // Total vessels generated

            // DRAW SCORE LOGOS
            const currentScore = scoreRef.current;
            const currentFailedVesselsCount = failedVesselsCountRef.current;

            const margin = 20;
            const logoSize = 40;
            const canvasWidth = canvas.width;

            let xPosition = canvasWidth - margin;

            context.font = '20px Arial';
            context.fillStyle = '#545454';
            context.textBaseline = 'middle';

            context.fillText(
              totalVesselsCount.toString(),
              xPosition,
              margin + logoSize / 2
            );
            
            xPosition -= context.measureText(totalVesselsCount.toString()).width + 10;
            
            context.drawImage(
              spaceshipLogoImage,
              xPosition - logoSize,
              margin,
              logoSize,
              logoSize
            );
            
            xPosition -= logoSize + 10;

            context.textAlign = 'right';
            context.fillText(
              currentScore.toString(),
              xPosition,
              margin + logoSize / 2
            );

            const scoreTextWidth = context.measureText(currentScore.toString()).width;
            xPosition -= scoreTextWidth + 10;

            context.drawImage(
              starLogoImage,
              xPosition - logoSize,
              margin,
              logoSize,
              logoSize
            );

            xPosition -= logoSize + 10;

            const successPercentage = (((VESSEL_PER_LEVEL - currentFailedVesselsCount) / VESSEL_PER_LEVEL) * 100).toFixed(2);

            context.fillText(
              successPercentage + '%',
              xPosition,
              margin + logoSize / 2
            );

            const percentageTextWidth = context.measureText(successPercentage + '%').width;
            xPosition -= percentageTextWidth + 10;

            context.drawImage(
              percentageLogoImage,
              xPosition - logoSize,
              margin,
              logoSize,
              logoSize
            );

            const planetsPositions = currentLevel.planets.map((planet: Planet) => ({
                ...planet,
                position: {
                x: planet.position.x * canvas.width,
                y: planet.position.y * canvas.height,
                },
            }));

            // DRAW PLANETS
            planetsPositions.forEach((planet: Planet) => {
                const imageWidth = planetImage.width;
                const imageHeight = planetImage.height;
    
                context.save();
                context.translate(planet.position.x, planet.position.y);
    
                context.drawImage(
                planetImage,
                -imageWidth / 2,
                -imageHeight / 2,
                imageWidth,
                imageHeight
                );
    
                context.restore();
            });

            // DRAW VESSELS
            vesselsRef.current.forEach((vessel: Vessel) => {
                if (!vessel.isArrived) {
                    // DRAW VESSEL STREAK
                    if (vessel.path.length > 1) {
                      const trailColor = VELOCITY_COLORS[vessel.speedState];
        
                      context.beginPath();
                      context.moveTo(vessel.path[0].x, vessel.path[0].y);
                      for (let i = 1; i < vessel.path.length; i++) {
                        context.lineTo(vessel.path[i].x, vessel.path[i].y);
                      }
                      context.strokeStyle = trailColor;
                      context.lineWidth = 1;
                      context.stroke();
                      context.closePath();
                    }
              
                    const vesselImage = getVesselImage(vessel.speedState);
                    const imageWidth = vesselImage.width;
                    const imageHeight = vesselImage.height;
              
                    context.save();
              
                    const angle = Math.atan2(vessel.direction.y, vessel.direction.x);
                    context.translate(vessel.position.x, vessel.position.y);
                    context.rotate(angle);
              
                    context.drawImage(
                      vesselImage,
                      -imageWidth / 2,
                      -imageHeight / 2,
                      imageWidth,
                      imageHeight
                    );
              
                    context.restore();
              
                    // DRAW TIMER
                    const timeRatio = vessel.timeRemaining / vessel.totalTime;
                    const radius = 15;
              
                    const timerColor = VELOCITY_COLORS[vessel.speedState];
      
                    context.beginPath();
                    context.arc(
                      vessel.position.x,
                      vessel.position.y,
                      radius,
                      -Math.PI / 2,
                      -Math.PI / 2 + 2 * Math.PI * timeRatio
                    );
                    context.strokeStyle = timerColor;
                    context.lineWidth = 1;
                    context.stroke();
                    context.closePath();
              
                    // DISPLAY TIME REMAINING
                    context.font = '12px Arial';
                    context.fillStyle = timerColor;
                    context.textAlign = 'center';
                    context.fillText(
                      Math.ceil(vessel.timeRemaining).toString(),
                      vessel.position.x,
                      vessel.position.y - 20
                    );
                }
            });

            // DRAW PORTALS
            if (currentDifficulty >= 2) {
              portalsRef.current.forEach((portal) => {
                context.beginPath();
                context.arc(portal.position.x, portal.position.y, portal.radius, 0, 2 * Math.PI);
                context.strokeStyle = 'rgba(128, 0, 128, 0.7)';
                context.lineWidth = 1;
                context.stroke();
                context.closePath();
      
                context.beginPath();
                context.arc(portal.position.x, portal.position.y, portal.radius * 0.7, 0, 2 * Math.PI);
                context.strokeStyle = 'rgba(75, 0, 130, 0.7)';
                context.lineWidth = 1;
                context.stroke();
                context.closePath();
              });
            }

            if (currentDifficulty >= 3) {
              enemyVesselsRef.current.forEach((enemyVessel) => {
                if (!enemyVessel.isDestroyed) {
                  // Draw enemy vessel
                  const imageWidth = enemyVesselImage.width;
                  const imageHeight = enemyVesselImage.height;
      
                  context.save();
      
                  const angle = Math.atan2(enemyVessel.direction.y, enemyVessel.direction.x);
                  context.translate(enemyVessel.position.x, enemyVessel.position.y);
                  context.rotate(angle);
      
                  context.drawImage(
                    enemyVesselImage,
                    -imageWidth / 2,
                    -imageHeight / 2,
                    imageWidth,
                    imageHeight
                  );
      
                  context.restore();
                }
              });
            }

            shotsRef.current.forEach((shot) => {
              if (shot.isActive) {
                context.beginPath();
                context.arc(shot.position.x, shot.position.y, 3, 0, 2 * Math.PI);
                context.fillStyle = '#000';
                context.fill();
                context.closePath();
              }
            });

            // DRAW CLICK EFFECTS
            clickEffectsRef.current.forEach((effect) => {
              context.beginPath();
              context.arc(
                effect.position.x,
                effect.position.y,
                effect.radius,
                0,
                2 * Math.PI
              );
              context.strokeStyle = `rgba(84, 84, 84, ${effect.alpha})`;
              context.lineWidth = 2;
              context.stroke();
              context.closePath();
            });

            // DRAW SUCCESS EFFECTS
            successEffectsRef.current.forEach((effect) => {
              context.beginPath();
              context.arc(
                effect.position.x,
                effect.position.y,
                effect.radius,
                0,
                2 * Math.PI
              );
              context.strokeStyle = `rgba(0, 255, 0, ${effect.alpha})`;
              context.lineWidth = 2;
              context.stroke();
              context.closePath();
            });

            // DRAW FAILURE EFFECTS
            failureEffectsRef.current.forEach((effect) => {
              context.beginPath();
              context.arc(
                effect.position.x,
                effect.position.y,
                effect.radius,
                0,
                2 * Math.PI
              );
              context.strokeStyle = `rgba(255, 0, 0, ${effect.alpha})`;
              context.lineWidth = 2;
              context.stroke();
              context.closePath();
            });

            // DRAW FLOATING TEXTS
            floatingTextsRef.current.forEach((text: FloatingText) => {
              context.globalAlpha = text.alpha;
              context.fillStyle = text.color;
              context.font = 'bold 16px Arial';
              context.textAlign = 'center';
              context.fillText(text.text, text.position.x, text.position.y);
              context.globalAlpha = 1;
            });
          }

          const render = () => {
            if (!isPaused) {
              update();
              draw();
            } else {
              draw();
            }
            animationFrameId = requestAnimationFrame(render);
          };
  
          render();

          // WINDOW RESIZE METHOD
          const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
          };
  
          window.addEventListener('resize', handleResize);
  
          return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('resize', resizeCanvas);
          };
        }
    }
  }, [isPaused, currentLevel, currentDifficulty]);

  return (
    <canvas 
      ref={canvasRef} 
      onMouseMove={handleMouseMove}
      onClick={handleCanvasClick}
      onContextMenu={handleCanvasContextMenu}
    />
  );
}

export default GameCanvas;