import {
  AfterViewInit,
  ComponentRef,
  Directive,
  OnDestroy,
  ViewContainerRef,
} from '@angular/core';
import { combineLatest, interval, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';
import {
  generator,
  randomEnum,
  isIonicReady,
  randomIntegerBetween,
} from 'src/utilities';
import { SubSink } from 'subsink';
import { ArtifactComponent } from '../components';
import { Action, Collision, GameStatus } from '../enums';
import { Artifact, Coordinates, HitArtifact } from '../models';
import {
  ArtifactsService,
  CollisionService,
  GameControlsService,
  SizesService,
} from '../services';

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

  constructor(
    private controls: GameControlsService,
    private collision: CollisionService,
    private sizes: SizesService,
    private viewContainerRef: ViewContainerRef,
    private artifacts: ArtifactsService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.onStatusChanged();
    this.onTimer();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private onStatusChanged(): void {
    this.subSink.sink = this.onRematch$.subscribe(() =>
      this.viewContainerRef.clear()
    );
  }

  private onTimer(): void {
    // TODO: make it more randomic
    this.subSink.sink = interval(13000).subscribe(() => {
      this.generateRandomArtifact();
    });
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
    // TODO: find a better range
    return {
      x: randomIntegerBetween(
        this.sizes.pixelsFromEdges,
        this.sizes.groundWidth - this.sizes.pixelsFromEdges
      ),
      y: randomIntegerBetween(
        this.sizes.pixelsFromEdges,
        this.sizes.groundHeight - this.sizes.pixelsFromEdges
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
    this.onActivation(componentRef);
  }

  private onActivation(componentRef: ComponentRef<ArtifactComponent>): void {
    this.subSink.sink = this.artifacts.onActivation$
      .pipe(
        filter(
          (hitArtifact: HitArtifact) =>
            hitArtifact.artifact.id === componentRef.instance.id
        )
      )
      .subscribe(() => {
        componentRef.destroy();
      });
  }
}
