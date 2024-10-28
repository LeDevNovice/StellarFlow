import { Level } from '../models/level.model';

export const levels: Level[] = [
  {
    id: 1,
    name: 'Square',
    planets: [
      { id: 1, position: { x: 0.25, y: 0.25 }, radius: 50, color: '#00aaff' },
      { id: 2, position: { x: 0.25, y: 0.75 }, radius: 50, color: '#00aaff' },
      { id: 3, position: { x: 0.75, y: 0.25 }, radius: 50, color: '#00aaff' },
      { id: 4, position: { x: 0.75, y: 0.75 }, radius: 50, color: '#00aaff' },
    ],
  },
  {
    id: 2,
    name: 'Triangle',
    planets: [
      { id: 1, position: { x: 0.5, y: 0.2 }, radius: 50, color: '#00aaff' },
      { id: 2, position: { x: 0.3, y: 0.8 }, radius: 50, color: '#00aaff' },
      { id: 3, position: { x: 0.7, y: 0.8 }, radius: 50, color: '#00aaff' },
    ],
  },
  {
    id: 3,
    name: 'Pentagon',
    planets: [
      { id: 1, position: { x: 0.5, y: 0.2 }, radius: 50, color: '#00aaff' },
      { id: 2, position: { x: 0.8, y: 0.4 }, radius: 50, color: '#00aaff' },
      { id: 3, position: { x: 0.7, y: 0.8 }, radius: 50, color: '#00aaff' },
      { id: 4, position: { x: 0.3, y: 0.8 }, radius: 50, color: '#00aaff' },
      { id: 5, position: { x: 0.2, y: 0.4 }, radius: 50, color: '#00aaff' },
    ],
  },
];
