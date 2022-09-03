import { Action } from '../enums';
import { Coordinates } from './coordinates.model';

export interface Artifact {
  id: number;
  action: Action;
  coordinates: Coordinates;
}
