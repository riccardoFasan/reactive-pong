import { Level } from '../enums';
import { ArtifactsTiming } from './artifacts-timing.model';
import { Ball } from './ball.model';
import { ComputerSettings } from './computer-settings.model';
import { ResizingSettings } from './resizing-settings.model';

export interface LevelSettings {
  name: string;
  value: Level;
  ball: Ball;
  computer: ComputerSettings;
  artifactsTiming: ArtifactsTiming;
  resizingSettings: ResizingSettings;
  shieldsDuration: number;
}
