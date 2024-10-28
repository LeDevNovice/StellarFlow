import { Point } from './point.model';

export interface Planet {
  id: number;
  position: Point;
  radius: number;
  color: string;
}