import { Inaccuracy, Level } from '../enums';
import { Ball } from './ball.model';

export interface LevelSettings {
  name: string;
  value: Level;
  ball: Ball;
  computerInaccuracy: Inaccuracy;
}
