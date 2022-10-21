import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
} from '@angular/core';
import { EMPTY, iif, timer } from 'rxjs';
import { filter, first, map, switchMap } from 'rxjs/operators';
import { HalfField, Player } from 'src/app/shared/enums';
import { PlayersService } from 'src/app/shared/services';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { Action, GameStatus } from '../enums';

import {
  HitArtifact,
  Artifact,
  ResizingSettings,
  LevelSettings,
} from '../models';

import {
  AnimatorService,
  ArtifactsService,
  CollisionService,
  ElementsService,
  GameControlsService,
  LevelService,
} from '../services';

import { NORMAL_RESIZING } from '../store';

@Directive({
  selector: '[appResizePaddle]',
})
export class ResizePaddleDirective implements AfterViewInit, OnDestroy {
  @Input() halfField!: HalfField;

  private defaultHeight: number = 0;

  private subSink: SubSink = new SubSink();

  private settings: ResizingSettings = NORMAL_RESIZING;

  constructor(
    private players: PlayersService,
    private artifacts: ArtifactsService,
    private animator: AnimatorService,
    private ref: ElementRef,
    private collision: CollisionService,
    private level: LevelService,
    private elements: ElementsService,
    private controls: GameControlsService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.setDefaultHeight();
    this.onActivation();
    this.onGoal();
    this.onLevelChanged();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private get player(): Player {
    return this.players.getPlayerByField(this.halfField);
  }

  private get scalingDifference(): number {
    return (this.elements.groundHeight / 100) * this.settings.percentage;
  }

  private get currentHeight(): number {
    return this.ref.nativeElement.offsetHeight;
  }

  private setDefaultHeight(): void {
    this.defaultHeight = parseFloat(
      window.getComputedStyle(this.ref.nativeElement).height
    );
  }

  private onActivation(): void {
    this.subSink.sink = this.artifacts.onActivation$
      .pipe(
        filter(
          (hitArtifact: HitArtifact) =>
            (hitArtifact.artifact.action === Action.Enlarge ||
              hitArtifact.artifact.action === Action.Reduce) &&
            this.canActivate(hitArtifact)
        ),
        map((hitArtifact: HitArtifact) => hitArtifact.artifact)
      )
      .subscribe((artifact: Artifact) => this.resize(artifact.action));
  }

  private onGoal(): void {
    this.subSink.sink = this.collision.onGatesCollision$.subscribe(() =>
      this.resetPaddleHeight()
    );
  }

  private onLevelChanged(): void {
    this.subSink.sink = this.level.levelChanged$
      .pipe(map((level: LevelSettings) => level.resizingSettings))
      .subscribe((settings: ResizingSettings) => {
        this.settings = settings;
      });
  }

  private canActivate(hitArtifact: HitArtifact): boolean {
    // * enlarge player, reduce opponent
    return (
      (hitArtifact.player === this.player &&
        hitArtifact.artifact.action === Action.Enlarge) ||
      (hitArtifact.player !== this.player &&
        hitArtifact.artifact.action === Action.Reduce)
    );
  }

  private resize(action: Action): void {
    const targetHeight: number =
      action === Action.Enlarge
        ? this.currentHeight + this.scalingDifference
        : this.currentHeight - this.scalingDifference;
    this.animator.setPaddleHeight(this.ref.nativeElement, targetHeight);
    this.onEffectFinished();
  }

  private onEffectFinished(): void {
    this.subSink.sink = this.controls.statusChanged$
      .pipe(
        switchMap((status: GameStatus) =>
          iif(
            () => status === GameStatus.Running,
            timer(this.settings.duration).pipe(first()),
            EMPTY
          )
        )
      )
      .subscribe(() => this.resetPaddleHeight());
  }

  private resetPaddleHeight(): void {
    this.animator.setPaddleHeight(this.ref.nativeElement, this.defaultHeight);
  }
}
