import { Point } from "./point.model";

export interface Effect {
    position: Point;
    radius: number;
    alpha: number;
  }