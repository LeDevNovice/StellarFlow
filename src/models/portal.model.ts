import { Point } from "./point.model";

export interface Portal {
  id: number;
  position: Point;
  radius: number;
  maxRadius: number;
  isActive: boolean;
}