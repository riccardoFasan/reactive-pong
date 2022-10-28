import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, combineLatest, iif } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { SoundsStatus } from 'src/app/shared/enums';
import { PreferencesService } from 'src/app/shared/services';
import { Collision } from '../enums';
import { ArtifactsService } from './artifacts.service';
import { CollisionService } from './collision.service';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';

@Injectable({
  providedIn: 'root',
})
export class SoundsService {
  private statusStore$: BehaviorSubject<SoundsStatus> =
    new BehaviorSubject<SoundsStatus>(SoundsStatus.On);

  private onPaddleSoundPlayed$: Observable<Collision> =
    this.collisions.onPaddleCollision$.pipe(tap(() => this.playPaddleSound()));

  private onEdgeSoundPlayed$: Observable<Collision> =
    this.collisions.onEdgeCollision$.pipe(tap(() => this.playEdgeSound()));

  private onGatesSoundPlayed$: Observable<Collision> =
    this.collisions.onGatesCollision$.pipe(tap(() => this.playGatesSound()));

  private onShieldsSoundPlayed$: Observable<Collision> =
    this.collisions.onShieldsCollision$.pipe(
      tap(() => this.playShieldsSound())
    );

  private onArtifactSoundPlayed$: Observable<Collision> =
    this.artifacts.onArtifactCollision$.pipe(
      tap(() => this.playArtifactSound())
    );

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

  private readonly soundsPath: string = 'assets/sounds';

  constructor(
    private collisions: CollisionService,
    private artifacts: ArtifactsService,
    private perefences: PreferencesService,
    private nativeAudio: NativeAudio
  ) {}

  get status(): SoundsStatus {
    return this.statusStore$.getValue();
  }

  private set status(status: SoundsStatus) {
    this.statusStore$.next(status);
  }

  async init(): Promise<void> {
    this.preload();
    const soundsStatus: SoundsStatus | null =
      await this.perefences.getSoundsStatus();
    if (soundsStatus === SoundsStatus.Off) this.status = SoundsStatus.Off;
  }

  async setSounds(status: SoundsStatus): Promise<void> {
    this.status = status;
    this.perefences.setSoundsStatus(status);
  }

  private preload(): void {
    this.nativeAudio.preloadSimple('bounce', `${this.soundsPath}/bounce.mp3`);
    this.nativeAudio.preloadSimple('goal', `${this.soundsPath}/goal.mp3`);
    this.nativeAudio.preloadSimple('shield', `${this.soundsPath}/shield.mp3`);
    this.nativeAudio.preloadSimple(
      'artifact',
      `${this.soundsPath}/artifact.mp3`
    );
  }

  private playPaddleSound(): void {
    this.nativeAudio.play('bounce');
  }

  private playEdgeSound(): void {
    this.nativeAudio.play('bounce');
  }

  private playGatesSound(): void {
    this.nativeAudio.play('goal');
  }

  private playShieldsSound(): void {
    this.nativeAudio.play('shield');
  }

  private playArtifactSound(): void {
    this.nativeAudio.play('artifact');
  }
}
