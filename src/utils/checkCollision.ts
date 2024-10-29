import { Portal } from "../models/portal.model";
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

export const checkVesselPortalCollision = (vessel: Vessel, portal: Portal): boolean => {
  const dx = vessel.position.x - portal.position.x;
  const dy = vessel.position.y - portal.position.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance < portal.radius; // Collision if distance is less than portal radius
};