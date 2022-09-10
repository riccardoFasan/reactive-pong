import { Inaccuracy, Level } from '../enums';
import { ArtifactsTiming } from './artifacts-timing.model';
import { Ball } from './ball.model';
import { ResizingSettings } from './resizing-settings.model';

export interface LevelSettings {
  name: string;
  value: Level;
  ball: Ball;
  computerInaccuracy: Inaccuracy;
  artifactsTiming: ArtifactsTiming;
  resizingSettings: ResizingSettings;
  shieldsDuration: number;
}
