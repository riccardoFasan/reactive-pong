import { ElementRef, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, share } from 'rxjs/operators';
import { areColliding } from 'src/utilities';
import { Artifact, HitArtifact } from '../models';
import { GameControlsService, BallDirectionService } from '.';

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

  private ball!: HTMLElement;
  private activators: { artifact: Artifact; ref: ElementRef }[] = [];

  constructor(
    private controls: GameControlsService,
    private direction: BallDirectionService
  ) {}

  registerArtifact(artifact: Artifact, ref: ElementRef): void {
    this.activators = [...this.activators, { artifact, ref }];
  }

  unregisterArtifact(id: number): void {
    this.activators = this.activators.filter(
      (activator) => activator.artifact.id !== id
    );
  }

  registerBall(ball: HTMLElement): void {
    this.ball = ball;
  }

  private getHitArtifact(): HitArtifact | undefined {
    const artifact: Artifact | undefined = this.activators.reduce(
      (_: Artifact | undefined, activator) => {
        if (areColliding(activator.ref.nativeElement, this.ball)) {
          return activator.artifact;
        }
        return undefined;
      },
      undefined
    );
    if (!artifact) return undefined;
    return {
      artifact,
      player: this.direction.whoHitBall,
    };
  }
}
