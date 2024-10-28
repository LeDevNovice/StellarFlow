import { Point } from "../models/point.model";

// Computes the straight-line distance between two points a and b 
export function calculateDistance(a: Point, b: Point): number {
    return Math.hypot(b.x - a.x, b.y - a.y);
}