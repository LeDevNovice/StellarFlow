export const DESTINATION_RADIUS = 25;
export const MAX_TRAIL_LENGTH = 10000; // To have trail all along the path of the vessel
export const ANIMATION_SPEED = 10;
export const TOTAL_FRAMES = 4;
export const VESSEL_PER_LEVEL = 50;

// Colors for each speed state of the vessel
export const VELOCITY_COLORS: { [key: string]: string } = {
    normal: '#ff3131',
    slowed: '#5271ff',   
    accelerated: '#00bf63',
    invisible: '#d9d9d9', 
  };