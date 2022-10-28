import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, share } from 'rxjs/operators';
import { areColliding, getLocatedRect, LocatedRect } from 'src/utilities';
import { Artifact, HitArtifact } from '../models';
import {
  GameControlsService,
  BallDirectionService,
  ElementsService,
  BallService,
} from '.';
import { HalfField, Player } from 'src/app/shared/enums';
import { PlayersService } from 'src/app/shared/services';
import { Collision } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class ArtifactsService {
  onActivation$: Observable<HitArtifact> = this.controls.timer$.pipe(
    map(() => this.getHitArtifact()),
    // @ts-ignore
    filter((hitArtifact: HitArtifact | undefined) => hitArtifact !== undefined),
    share()
  );

  onArtifactCollision$: Observable<Collision> = this.onActivation$.pipe(
    map(() => Collision.Artifact),
    share()
  );

  constructor(
    private controls: GameControlsService,
    private direction: BallDirectionService,
    private players: PlayersService,
    private elements: ElementsService,
    private ballElement: BallService
  ) {}

  private getHitArtifact(): HitArtifact | undefined {
    const artifact: Artifact | undefined = this.elements.activators.reduce(
      (_: Artifact | undefined, activator) => {
        const activatorRect: LocatedRect = getLocatedRect(
          activator.ref.nativeElement
        );
        if (areColliding(activatorRect, this.ballElement.ballRect)) {
          return activator.artifact;
        }
        return undefined;
      },
      undefined
    );
    if (!artifact) return undefined;
    return {
      artifact,
      player: this.getActivePlayer(),
    };
  }

  private getActivePlayer(): Player {
    const whereBallComesFrom: HalfField = this.direction.isBallGoingRight
      ? HalfField.Left
      : HalfField.Right;
    return this.players.getPlayerByField(whereBallComesFrom);
  }
}
