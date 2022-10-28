import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, combineLatest, iif } from 'rxjs';
import { tap, switchMap } from 'rxjs/operators';
import { Collision } from '../enums';
import { ArtifactsService } from './artifacts.service';
import { CollisionService } from './collision.service';

@Injectable({
  providedIn: 'root',
})
export class SoundsService {
  private onSoundsEnabled$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

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

  onSoundPlayed$: Observable<void> = this.onSoundsEnabled$.pipe(
    switchMap((isEnabled: boolean) =>
      iif(
        () => isEnabled,
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
    private artifacts: ArtifactsService
  ) {}

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

  private playSound(sound: string): void {
    const audio: HTMLAudioElement = new Audio(
      `${this.soundsPath}/${sound}.mp3`
    );
    audio.play();
  }
}
