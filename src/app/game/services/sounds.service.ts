import { Injectable } from '@angular/core';
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
    private perefences: PreferencesService
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
    this.preloadSound('bounce');
    this.preloadSound('bounce');
    this.preloadSound('goal');
    this.preloadSound('shield');
    this.preloadSound('artifact');
  }

  private playPaddleSound(): void {
    this.playSound('bounce');
  }

  private playEdgeSound(): void {
    this.playSound('bounce');
  }

  private playGatesSound(): void {
    this.playSound('goal');
  }

  private playShieldsSound(): void {
    this.playSound('shield');
  }

  private playArtifactSound(): void {
    this.playSound('artifact');
  }

  private preloadSound(sound: string): void {
    const audio: HTMLAudioElement = new Audio(
      `${this.soundsPath}/${sound}.mp3`
    );
    audio.volume = 0;
    audio.play();
  }

  private playSound(sound: string): void {
    const audio: HTMLAudioElement = new Audio(
      `${this.soundsPath}/${sound}.mp3`
    );
    audio.play();
  }
}
