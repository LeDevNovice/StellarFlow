import React, { useRef, useEffect } from 'react';

import { 
  titleImage, 
  getVesselImage,
  normalVesselImage,
  slowVesselImage,
  fastVesselImage,
  invisibleVesselImage
} from "../../utils/loadImage";
import { Point } from '../../models/point.model';
import './HomeScreen.css';

interface HomeScreenProps {
  onPlay: () => void;
  onHelp: () => void;
}

type SpeedState = 'normal' | 'slowed' | 'accelerated' | 'invisible';

interface Vessel {
  position: Point;
  velocity: number;
  direction: Point;
  speedState: SpeedState;
  trail: Point[];
  angle: number; // For rotation
  color: string;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ onPlay, onHelp }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vesselsRef = useRef<Vessel[]>([]);
  const animationRef = useRef<number>(0);

  const NUMBER_OF_VESSELS = 50;
  const TRAIL_LENGTH = 10;
  const VESSEL_SIZE = 10;

  const getRandom = (min: number, max: number) => Math.random() * (max - min) + min;

  const getRandomSpeedState = (): SpeedState => {
    const speedStates: SpeedState[] = ['normal', 'slowed', 'accelerated', 'invisible'];
    return speedStates[Math.floor(Math.random() * speedStates.length)];
  };

  const calculateDirection = (from: Point, to: Point): Point => {
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return { x: dx / distance, y: dy / distance };
  };

  const initializeVessels = (width: number, height: number) => {
    const vessels: Vessel[] = [];
    for (let i = 0; i < NUMBER_OF_VESSELS; i++) {
      const startPosition: Point = {
        x: getRandom(0, width),
        y: getRandom(0, height),
      };
      const destination: Point = {
        x: getRandom(0, width),
        y: getRandom(0, height),
      };
      const direction = calculateDirection(startPosition, destination);
      const velocity = getRandom(50, 80);
      const speedState = getRandomSpeedState();
      const angle = Math.atan2(direction.y, direction.x);
      const color = getColorFromSpeedState(speedState);

      vessels.push({
        position: { ...startPosition },
        velocity,
        direction,
        speedState,
        trail: [],
        angle,
        color,
      });
    }
    vesselsRef.current = vessels;
  };

  const getColorFromSpeedState = (speedState: SpeedState): string => {
    switch (speedState) {
      case 'normal':
        return '#ff3131';
      case 'slowed':
        return '#5271ff';
      case 'accelerated':
        return '#00bf63';
      case 'invisible':
        return '#d9d9d9';
      default:
        return '#ff3131'; 
    }
  };

  const updateVessels = (deltaTime: number, width: number, height: number) => {
    vesselsRef.current.forEach((vessel) => {
      vessel.position.x += vessel.direction.x * vessel.velocity * deltaTime;
      vessel.position.y += vessel.direction.y * vessel.velocity * deltaTime;
      vessel.angle = Math.atan2(vessel.direction.y, vessel.direction.x);

      vessel.trail.push({ ...vessel.position });
      if (vessel.trail.length > TRAIL_LENGTH) {
        vessel.trail.shift();
      }

      if (
        vessel.position.x < 0 ||
        vessel.position.x > width ||
        vessel.position.y < 0 ||
        vessel.position.y > height
      ) {
        vessel.position = {
          x: getRandom(0, width),
          y: getRandom(0, height),
        };
        const newDestination: Point = {
          x: getRandom(0, width),
          y: getRandom(0, height),
        };
        vessel.direction = calculateDirection(vessel.position, newDestination);
        vessel.velocity = getRandom(50, 90);
        vessel.speedState = getRandomSpeedState();
        vessel.color = getColorFromSpeedState(vessel.speedState);
        vessel.trail = [];
        vessel.angle = Math.atan2(vessel.direction.y, vessel.direction.x);
      }
    });
  };

  const draw = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    ctx.clearRect(0, 0, width, height);

    drawStaticRings(ctx, width, height);

    vesselsRef.current.forEach((vessel) => {
      // Draw trail
      if (vessel.trail.length > 1) {
        ctx.beginPath();
        ctx.moveTo(vessel.trail[0].x, vessel.trail[0].y);
        for (let i = 1; i < vessel.trail.length; i++) {
          ctx.lineTo(vessel.trail[i].x, vessel.trail[i].y);
        }
        ctx.strokeStyle = vessel.color;
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.closePath();
      }

      ctx.save();
      ctx.translate(vessel.position.x, vessel.position.y);
      ctx.rotate(vessel.angle);

      const vesselImage = getVesselImage(vessel.speedState);

      ctx.drawImage(
        vesselImage,
        -VESSEL_SIZE,
        -VESSEL_SIZE,
        VESSEL_SIZE * 2,
        VESSEL_SIZE * 2
      );

      ctx.restore();
    });
  };

  const drawStaticRings = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    const rings = [
      {
        center: { x: width * 0.2, y: height * 0.1 },
        radius: 250,
        colorStart: 'rgba(255, 165, 0)',
        colorEnd: 'rgba(255, 165, 0)',
        lineWidth: 60,
      },
      {
        center: { x: width * 0.9, y: height * 0.9 },
        radius: 600,
        colorStart: 'rgba(255, 165, 0)',
        colorEnd: 'rgba(255, 165, 0)',
        lineWidth: 60,
      },
    ];

    rings.forEach((ring) => {
      const gradient = ctx.createRadialGradient(
        ring.center.x,
        ring.center.y,
        ring.radius * 0.8,
        ring.center.x,
        ring.center.y,
        ring.radius
      );
      gradient.addColorStop(0, ring.colorStart);
      gradient.addColorStop(1, ring.colorEnd);

      ctx.beginPath();
      ctx.arc(ring.center.x, ring.center.y, ring.radius, 0, 2 * Math.PI);
      ctx.strokeStyle = gradient;
      ctx.lineWidth = ring.lineWidth;
      ctx.stroke();
      ctx.closePath();
    });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!canvas || !ctx) return;

    let lastTime = performance.now();

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initializeVessels(canvas.width, canvas.height);
    };

    resizeCanvas();

    window.addEventListener('resize', resizeCanvas);

    const animate = (time: number) => {
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      updateVessels(deltaTime, canvas.width, canvas.height);
      draw(ctx, canvas.width, canvas.height);

      animationRef.current = requestAnimationFrame(animate);
    };

    const images = [normalVesselImage, slowVesselImage, fastVesselImage, invisibleVesselImage, titleImage];
    let loadedImages = 0;

    images.forEach((img) => {
      if (img.complete) {
        loadedImages += 1;
        if (loadedImages === images.length) {
          animationRef.current = requestAnimationFrame(animate);
        }
      } else {
        img.onload = () => {
          loadedImages += 1;
          if (loadedImages === images.length) {
            animationRef.current = requestAnimationFrame(animate);
          }
        };

        img.onerror = () => {
          console.error('Failed to load image:', img.src);
        };
      }
    });

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="home-screen">
      <canvas ref={canvasRef} className="home-canvas" />
      <div className="home-content">
        <img className='home-title' src={titleImage.src} alt="Title" />
        <div className="home-buttons">
          <button onClick={onPlay}>Play</button>
          <button onClick={onHelp}>Help</button>
        </div>
      </div>
    </div>
  );
};

export default HomeScreen;
