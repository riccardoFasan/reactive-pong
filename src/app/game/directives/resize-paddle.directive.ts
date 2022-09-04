import {
  AfterViewInit,
  Directive,
  ElementRef,
  Input,
  OnDestroy,
} from '@angular/core';
import { filter, map, throttleTime } from 'rxjs/operators';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { Action, HalfField, Player } from '../enums';
import { HitArtifact, Artifact } from '../models';
import {
  AnimationsService,
  ArtifactsService,
  CollisionService,
  GroundSizesService,
  PlayersService,
} from '../services';

@Directive({
  selector: '[appResizePaddle]',
})
export class ResizePaddleDirective implements AfterViewInit, OnDestroy {
  @Input() halfField!: HalfField;

  private defaultHeight: number = 0;

  private subSink: SubSink = new SubSink();

  private readonly duration: number = 10000; // TODO: make it variable by difficulty
  private readonly differencePercentage: number = 7; // TODO: make it variable by difficulty

  constructor(
    private players: PlayersService,
    private artifacts: ArtifactsService,
    private animations: AnimationsService,
    private ref: ElementRef,
    private ground: GroundSizesService,
    private collision: CollisionService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.setDefaultHeight();
    this.onActivation();
    this.onGoal();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private get player(): Player {
    return this.players.getPlayerByField(this.halfField);
  }

  private get scalingDifference(): number {
    return (this.ground.height / 100) * this.differencePercentage;
  }

  private setDefaultHeight(): void {
    this.defaultHeight = parseFloat(
      window.getComputedStyle(this.ref.nativeElement).height
    );
  }

  private onActivation(): void {
    this.subSink.sink = this.artifacts.onActivation$
      .pipe(
        filter((hitArtifact: HitArtifact) => this.canActivate(hitArtifact)),
        throttleTime(this.duration),
        map((hitArtifact: HitArtifact) => hitArtifact.artifact)
      )
      .subscribe((artifact: Artifact) => this.resize(artifact.action));
  }

  private onGoal(): void {
    this.subSink.sink = this.collision.onGatesCollision$.subscribe(() =>
      this.animations.setPaddleHeight(
        this.ref.nativeElement,
        this.defaultHeight
      )
    );
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
        ? this.defaultHeight + this.scalingDifference
        : this.defaultHeight - this.scalingDifference;
    this.animations.resizePaddle(
      this.ref.nativeElement,
      this.duration,
      targetHeight,
      this.defaultHeight
    );
  }
}
