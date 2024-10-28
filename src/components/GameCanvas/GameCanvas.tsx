import { useContext, useEffect, useRef } from "react";

import planetImageSrc from '../../assets/images/planet.webp';
import { Planet } from "../../models/planet.model";
import { GameContext } from "../../context/GameProvider";

// IMAGE LOADING
const planetImage = new Image(50, 50);
planetImage.src = planetImageSrc;

const GameCanvas = () => {
  const { currentLevel } = useContext(GameContext)!;

  const canvasRef = useRef<HTMLCanvasElement>(null);

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

            // Draw Planets
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
          }

          const render = () => {
            draw();
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
  })

  return (
    <canvas ref={canvasRef}/>
  );
}

export default GameCanvas;