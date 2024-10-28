// imageAssets.ts
import planetImageSrc from '../assets/images/planet.webp';
import normalVesselImageSrc from '../assets/images/normalVessel.webp';
import fastVesselImageSrc from '../assets/images/fastVessel.webp';
import slowVesselImageSrc from '../assets/images/slowVessel.webp';
import invisibleVesselImageSrc from '../assets/images/invisibleVessel.webp';

export const planetImage = new Image(50, 50);
planetImage.src = planetImageSrc;
export const normalVesselImage = new Image(10, 10);
normalVesselImage.src = normalVesselImageSrc;
export const fastVesselImage = new Image(10, 10);
fastVesselImage.src = fastVesselImageSrc;
export const slowVesselImage = new Image(10, 10);
slowVesselImage.src = slowVesselImageSrc;
export const invisibleVesselImage = new Image(10, 10);
invisibleVesselImage.src = invisibleVesselImageSrc;

export const getVesselImage = (speedState: string): HTMLImageElement => {
  switch (speedState) {
    case 'normal':
      return normalVesselImage;
    case 'slowed':
      return slowVesselImage;
    case 'accelerated':
      return fastVesselImage;
    case 'invisible':
      return invisibleVesselImage;
    default:
      return normalVesselImage;
  }
};
