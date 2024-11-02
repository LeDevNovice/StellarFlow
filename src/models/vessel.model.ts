import { Point } from './point.model';

export interface Vessel {
  id: number;
  position: Point;
  velocity: number;
  direction: Point;
  destination: Point;
  isSlowed: boolean;
  isArrived: boolean;
  timeRemaining: number;
  totalTime: number;
  path: Point[];
  animationFrame: number;
  invisibilityTimeoutId?: number;
  speedState: 'normal' | 'slowed' | 'accelerated' | 'invisible';
}
