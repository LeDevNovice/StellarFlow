import { useContext, useEffect, useRef, useState } from "react";

import { GameContext } from "../../context/GameProvider";
import { 
  planetImage, 
  getVesselImage 
} from "../../utils/loadImage";

import { Effect } from "../../models/effect.model";
import { Level } from "../../models/level.model";
import { Planet } from "../../models/planet.model";
import { Point } from "../../models/point.model";
import { Vessel } from "../../models/vessel.model";
import { calculateDistance } from "../../utils/calculateDistance";
import { calculateDirection } from "../../utils/calculateDirection";
import { getRandomFactor } from "../../utils/getRandomFactor";
import { checkCollision } from "../../utils/checkCollision";
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
  const { vessels: contextVessels, setVessels, currentLevel } = useContext(GameContext)!;

  const [isPaused, setIsPaused] = useState(false);
  const [hoveredVessel, setHoveredVessel] = useState<Vessel | null>(null);
  const [isHoveringVessel, setIsHoveringVessel] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const clickEffectsRef = useRef<Effect[]>([]);
  const vesselsRef = useRef<Vessel[]>([]);
  const vesselsGenerated = useRef(0);

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
      switch (hoveredVessel.speedState) {
        case 'normal':
          hoveredVessel.speedState = 'slowed';
          break;
        case 'slowed':
          hoveredVessel.speedState = 'accelerated';
          break;
        case 'accelerated':
          hoveredVessel.speedState = 'invisible';
          // Define a timer to return to normal state
          setTimeout(() => {
            hoveredVessel.speedState = 'normal';
            setVessels([...vesselsRef.current]);
          }, 5000);
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

  const createClickEffect = (position: Point) => {
    const effect = {
      position: { ...position },
      radius: 0,
      maxRadius: 15,
      alpha: 1,
    };
    clickEffectsRef.current.push(effect);
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
  
        // If the two vessels are not arrived
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
    }
  };  

    useEffect(() => {
        vesselsRef.current = contextVessels;
    }, [contextVessels]);
    
    useEffect(() => {
      const canvas = canvasRef.current;

      if (canvas) {
        canvas.style.cursor = isHoveringVessel ? 'pointer' : 'default';
      }
    }, [isHoveringVessel]);

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
    }, [currentLevel, setVessels, isPaused]);

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
                }

                const distanceToDestination = calculateDistance(vessel.position, vessel.destination);
                if (distanceToDestination <= DESTINATION_RADIUS) {
                    vessel.isArrived = true;
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

            // UPDATE CLICK EFFECTS
            clickEffectsRef.current = clickEffectsRef.current.filter((effect) => {
              effect.radius += 50 * deltaTime;
              effect.alpha -= deltaTime * 2;
              return effect.alpha > 0;
            });

            handleCollisions();
          }

          // DRAWING ON CANVAS METHOD
          const draw = () => {
            context.clearRect(0, 0, canvas.width, canvas.height); // to reset canvas at each frame

            // Recalculate absolute positions in function of canvas size
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
  }, [isPaused, currentLevel])

  return (
    <canvas 
      ref={canvasRef} 
      onMouseMove={handleMouseMove}
      onClick={handleCanvasClick}
    />
  );
}

export default GameCanvas;