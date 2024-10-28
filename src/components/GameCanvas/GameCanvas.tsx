import { useRef } from "react";

const GameCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  return (
    <canvas ref={canvasRef}/>
  );
}

export default GameCanvas;