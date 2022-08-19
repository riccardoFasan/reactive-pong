import { Inaccuracy } from '../enums';
import { Ball } from './ball.model';

export interface LevelSettings {
  name: string;
  ball: Ball;
  computerInaccuracy: Inaccuracy;
}
