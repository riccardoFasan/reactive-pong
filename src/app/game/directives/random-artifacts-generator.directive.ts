import {
  AfterViewInit,
  ComponentRef,
  Directive,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { combineLatest, interval, Observable, race, timer } from 'rxjs';
import { filter, first, map, switchMap, tap } from 'rxjs/operators';
import {
  generator,
  randomEnum,
  isIonicReady,
  randomIntegerBetween,
  randomBoolean,
} from 'src/utilities';
import { SubSink } from 'subsink';
import { ArtifactComponent } from '../components';
import { Action, Collision, GameStatus } from '../enums';
import {
  Artifact,
  ArtifactsTiming,
  Coordinates,
  HitArtifact,
  LevelSettings,
} from '../models';
import {
  ArtifactsService,
  CollisionService,
  ElementsService,
  GameControlsService,
  LevelService,
} from '../services';
import { NORMAL_ARTIFACT } from '../store';

@Directive({
  selector: '[appRandomArtifactsGenerator]',
})
export class RandomArtifactsGeneratorDirective
  implements AfterViewInit, OnDestroy
{
  private subSink: SubSink = new SubSink();

  private onStop$: Observable<GameStatus> = this.controls.statusChanged$.pipe(
    filter((status: GameStatus) => status === GameStatus.Stopped)
  );

  private onRematch$: Observable<[GameStatus, Collision]> = combineLatest([
    this.onStop$,
    this.collision.onGatesCollision$,
  ]);

  private timing: ArtifactsTiming = NORMAL_ARTIFACT;

  private timer$: Observable<number> = this.level.levelChanged$.pipe(
    switchMap(() =>
      interval(this.timing.timer.min).pipe(
        switchMap(() => {
          const delta: number = this.timing.timer.max - this.timing.timer.max;
          return interval(delta).pipe(
            first(),
            filter(() => randomBoolean()),
            tap(() => this.generateRandomArtifact())
          );
        })
      )
    )
  );

  constructor(
    private controls: GameControlsService,
    private collision: CollisionService,
    private viewContainerRef: ViewContainerRef,
    private artifacts: ArtifactsService,
    private level: LevelService,
    private elements: ElementsService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.onRematch();
    this.onLevelChanged();
    this.onTimer();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private onRematch(): void {
    this.subSink.sink = this.onRematch$.subscribe(() =>
      this.viewContainerRef.clear()
    );
  }

  private onLevelChanged(): void {
    this.subSink.sink = this.level.levelChanged$
      .pipe(map((level: LevelSettings) => level.artifactsTiming))
      .subscribe((timing: ArtifactsTiming) => {
        this.timing = timing;
      });
  }

  private onTimer(): void {
    this.subSink.sink = this.timer$.subscribe();
  }

  private generateRandomArtifact(): void {
    if (this.controls.currentStatus === GameStatus.Running) {
      const artifact: Artifact = this.getRandomArtifact();
      this.placeArtifact(artifact);
    }
  }

  private getRandomArtifact(): Artifact {
    const id: number = generator.next().value;
    const action: Action = this.getRandomAction();
    const coordinates: Coordinates = this.getRandomCoordinates();
    return { id, action, coordinates };
  }

  private getRandomAction(): Action {
    return randomEnum(Action);
  }

  private getRandomCoordinates(): Coordinates {
    const verticalMargin: number = this.elements.edgesDistance;
    const horizontalMargin: number = this.elements.edgesDistance * 2.5;
    return {
      x: randomIntegerBetween(
        horizontalMargin,
        this.elements.groundWidth - horizontalMargin
      ),
      y: randomIntegerBetween(
        verticalMargin / 2, // ! I don't know why it blows up without / 2
        this.elements.groundHeight - verticalMargin
      ),
    };
  }

  private placeArtifact(artifact: Artifact): void {
    const componentRef: ComponentRef<ArtifactComponent> =
      this.viewContainerRef.createComponent<ArtifactComponent>(
        ArtifactComponent
      );
    componentRef.instance.id = artifact.id;
    componentRef.instance.action = artifact.action;
    componentRef.instance.coordinates = artifact.coordinates;
    this.onArtifactDestroy(componentRef);
  }

  private onArtifactDestroy(
    componentRef: ComponentRef<ArtifactComponent>
  ): void {
    this.subSink.sink = race([
      this.onActivation(componentRef),
      timer(this.timing.profitTime).pipe(first()),
    ]).subscribe(() => {
      componentRef.destroy();
    });
  }

  private onActivation(
    componentRef: ComponentRef<ArtifactComponent>
  ): Observable<HitArtifact> {
    return this.artifacts.onActivation$.pipe(
      filter(
        (hitArtifact: HitArtifact) =>
          hitArtifact.artifact.id === componentRef.instance.id
      )
    );
  }
}
