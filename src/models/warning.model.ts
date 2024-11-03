import { Point } from "./point.model";

export interface WarningIndicator {
  id: number;
  position: Point;
  remainingTime: number;
  totalTime: number;
}