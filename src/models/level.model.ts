import { Planet } from '../models/planet.model';

export interface Level {
  id: number;
  name: string;
  planets: Planet[];
}
