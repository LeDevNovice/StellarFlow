import planetImageSrc from '../assets/images/planet.webp';
import normalVesselImageSrc from '../assets/images/normalVessel.webp';
import fastVesselImageSrc from '../assets/images/fastVessel.webp';
import slowVesselImageSrc from '../assets/images/slowVessel.webp';
import invisibleVesselImageSrc from '../assets/images/invisibleVessel.webp';
import titleImageSrc from '../assets/images/title.webp'
import starLogoSrc from '../assets/images/starLogo.webp';
import spaceshipLogoSrc from '../assets/images/spaceshipLogo.webp'
import enemyVesselImageSrc from '../assets/images/enemyVessel.webp';
import percentageLogoSrc from '../assets/images/percentageLogo.webp';

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
export const titleImage = new Image();
titleImage.src = titleImageSrc;
export const starLogoImage = new Image();
starLogoImage.src = starLogoSrc;
export const percentageLogoImage = new Image();
percentageLogoImage.src = percentageLogoSrc;
export const spaceshipLogoImage = new Image();
spaceshipLogoImage.src = spaceshipLogoSrc;
export const enemyVesselImage = new Image(10, 10);
enemyVesselImage.src = enemyVesselImageSrc;


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
