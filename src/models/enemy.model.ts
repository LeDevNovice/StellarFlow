import { Point } from "./point.model";

export interface EnemyVessel {
  id: number;
  position: Point;
  velocity: number;
  direction: Point;
  destination: Point;
  isDestroyed: boolean;
  path: Point[];
  animationFrame: number;
}
