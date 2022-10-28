import { Injectable } from '@angular/core';
import { Howl } from 'howler';
import { BehaviorSubject, EMPTY, Observable, combineLatest, iif } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { SoundsStatus } from 'src/app/shared/enums';
import { PreferencesService } from 'src/app/shared/services';
import { Collision } from '../enums';
import { ArtifactsService } from './artifacts.service';
import { CollisionService } from './collision.service';

@Injectable({
  providedIn: 'root',
})
export class SoundsService {
  private statusStore$: BehaviorSubject<SoundsStatus> =
    new BehaviorSubject<SoundsStatus>(SoundsStatus.On);

  private onPaddleSoundPlayed$: Observable<Collision> =
    this.collisions.onPaddleCollision$.pipe(tap(() => this.paddle.play()));

  private onEdgeSoundPlayed$: Observable<Collision> =
    this.collisions.onEdgeCollision$.pipe(tap(() => this.edge.play()));

  private onGatesSoundPlayed$: Observable<Collision> =
    this.collisions.onGatesCollision$.pipe(tap(() => this.goal.play()));

  private onShieldsSoundPlayed$: Observable<Collision> =
    this.collisions.onShieldsCollision$.pipe(tap(() => this.shield.play()));

  private onArtifactSoundPlayed$: Observable<Collision> =
    this.artifacts.onArtifactCollision$.pipe(tap(() => this.artifact.play()));

  onSoundPlayed$: Observable<void> = this.statusStore$.pipe(
    switchMap((status: SoundsStatus) =>
      iif(
        () => status === SoundsStatus.On,
        combineLatest([
          this.onPaddleSoundPlayed$,
          this.onEdgeSoundPlayed$,
          this.onGatesSoundPlayed$,
          this.onShieldsSoundPlayed$,
          this.onArtifactSoundPlayed$,
        ]).pipe(switchMap(() => EMPTY)),
        EMPTY
      )
    )
  );

  private paddle: Howl = new Howl({
    src: ['/assets/sounds/bounce.mp3'],
  });
  private edge: Howl = new Howl({
    src: ['/assets/sounds/bounce.mp3'],
  });
  private goal: Howl = new Howl({
    src: ['/assets/sounds/goal.mp3'],
  });
  private shield: Howl = new Howl({
    src: ['/assets/sounds/shield.mp3'],
  });
  private artifact: Howl = new Howl({
    src: ['/assets/sounds/artifact.mp3'],
  });

  constructor(
    private collisions: CollisionService,
    private artifacts: ArtifactsService,
    private perefences: PreferencesService
  ) {}

  get status(): SoundsStatus {
    return this.statusStore$.getValue();
  }

  private set status(status: SoundsStatus) {
    this.statusStore$.next(status);
  }

  async init(): Promise<void> {
    // this.preload();
    const soundsStatus: SoundsStatus | null =
      await this.perefences.getSoundsStatus();
    if (soundsStatus === SoundsStatus.Off) this.status = SoundsStatus.Off;
  }

  async setSounds(status: SoundsStatus): Promise<void> {
    this.status = status;
    this.perefences.setSoundsStatus(status);
  }

  private preload(): void {
    this.paddle.load();
    this.edge.load();
    this.goal.load();
    this.shield.load();
    this.artifact.load();
  }
}
