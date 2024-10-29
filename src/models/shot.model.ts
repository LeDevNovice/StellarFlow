import { Point } from "./point.model";

export interface Shot {
  id: number;
  position: Point;
  velocity: number;
  direction: Point;
  destination: Point;
  isActive: boolean;
}