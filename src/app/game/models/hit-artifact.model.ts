import { Player } from 'src/app/shared/enums';
import { Artifact } from './artifact.model';

export interface HitArtifact {
  artifact: Artifact;
  player: Player;
}
