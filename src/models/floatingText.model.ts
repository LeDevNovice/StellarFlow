import { Point } from "../models/point.model";

export interface FloatingText {
  position: Point;
  text: string;
  color: string;
  alpha: number;
  lifespan: number;
}