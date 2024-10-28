import { Vessel } from "../models/vessel.model";
import { calculateDistance } from "./calculateDistance";

export function checkCollision(
    vesselA: Vessel,
    vesselB: Vessel,
    collisionRadius: number = 10
): boolean {
    const distance = calculateDistance(vesselA.position, vesselB.position);
    return distance < collisionRadius * 2;
}