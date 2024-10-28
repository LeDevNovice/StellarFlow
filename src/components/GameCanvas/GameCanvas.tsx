import { useContext, useEffect, useRef, useState } from "react";

import { GameContext } from "../../context/GameProvider";
import planetImageSrc from '../../assets/images/planet.webp';
import normalVesselImageSrc from '../../assets/images/normalVessel.webp';
import fastVesselImageSrc from '../../assets/images/fastVessel.webp';
import slowVesselImageSrc from '../../assets/images/slowVessel.webp';
import invisibleVesselImageSrc from '../../assets/images/invisibleVessel.webp';
import { Level } from "../../models/level.model";
import { Planet } from "../../models/planet.model";
import { Point } from "../../models/point.model";
import { Vessel } from "../../models/vessel.model";
import { calculateDistance } from "../../utils/calculateDistance";
import { calculateDirection } from "../../utils/calculateDirection";
import { getRandomFactor } from "../../utils/getRandomFactor";
import { 
  ANIMATION_SPEED, 
  DESTINATION_RADIUS, 
  MAX_TRAIL_LENGTH, 
  TOTAL_FRAMES, 
  VELOCITY_COLORS, 
  VESSEL_CLICK_RADIUS, 
  VESSEL_PER_LEVEL} 
from "../../utils/constants";

// IMAGE LOADING
const planetImage = new Image(50, 50);
planetImage.src = planetImageSrc;
const normalVesselImage = new Image(10, 10);
normalVesselImage.src = normalVesselImageSrc;
const fastVesselImage = new Image(10, 10);
fastVesselImage.src = fastVesselImageSrc;
const slowVesselImage = new Image(10, 10);
slowVesselImage.src = slowVesselImageSrc;
const invisibleVesselImage = new Image(10, 10);
invisibleVesselImage.src = invisibleVesselImageSrc;

// Define the right image in function of vessel speed state
const getVesselImage = (speedState: string): HTMLImageElement => {
    switch (speedState) {
      case 'normal':
        return normalVesselImage;
      case 'slowed':
        return slowVesselImage;
      case 'accelerated':
        return fastVesselImage;
      case 'invisible':
        return invisibleVesselImage;
      default:
        return normalVesselImage;
    }
  };

const GameCanvas = () => {
  const { vessels: contextVessels, setVessels, currentLevel } = useContext(GameContext)!;

  const [isPaused, setIsPaused] = useState(false);
  const [hoveredVessel, setHoveredVessel] = useState<Vessel | null>(null);
  const [isHoveringVessel, setIsHoveringVessel] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vesselsRef = useRef<Vessel[]>([]);
  const vesselsGenerated = useRef(0);

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

            // Mise à jour des vaisseaux
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
      onMouseMove={handleMouseMove}/>
  );
}

export default GameCanvas;