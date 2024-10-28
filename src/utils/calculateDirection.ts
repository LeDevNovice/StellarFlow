import { Point } from "../models/point.model";
import { calculateDistance } from "./calculateDistance";

// Computes a vector pointing from point a to point b
export function calculateDirection(a: Point, b: Point): Point {
    const distance = calculateDistance(a, b);

    return {
      x: (b.x - a.x) / distance,
      y: (b.y - a.y) / distance,
    }
};