import { Player } from '../enums';
import { Artifact } from './artifact.model';

export interface HitArtifact {
  artifact: Artifact;
  player: Player;
}
