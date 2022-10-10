import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, share } from 'rxjs/operators';
import { areColliding } from 'src/utilities';
import { Artifact, HitArtifact } from '../models';
import { GameControlsService, BallDirectionService, ElementsService } from '.';
import { HalfField, Player } from 'src/app/shared/enums';
import { PlayersService } from 'src/app/shared/services';

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

  constructor(
    private controls: GameControlsService,
    private direction: BallDirectionService,
    private players: PlayersService,
    private elements: ElementsService
  ) {}

  private getHitArtifact(): HitArtifact | undefined {
    const artifact: Artifact | undefined = this.elements.activators.reduce(
      (_: Artifact | undefined, activator) => {
        if (areColliding(activator.ref.nativeElement, this.elements.ball)) {
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
