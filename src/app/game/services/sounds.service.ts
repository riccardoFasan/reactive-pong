import { Injectable } from '@angular/core';
import { BehaviorSubject, EMPTY, Observable, combineLatest, iif } from 'rxjs';
import { tap, switchMap, mergeMap } from 'rxjs/operators';
import { Collision } from '../enums';
import { CollisionService } from './collision.service';

@Injectable({
  providedIn: 'root',
})
export class SoundsService {
  private onSoundsEnabled$: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(true);

  private onPaddleSoundPlayer$: Observable<Collision> =
    this.collisions.onPaddleCollision$.pipe(tap(() => this.playPaddleSound()));

  private onEdgeSoundPlayer$: Observable<Collision> =
    this.collisions.onEdgeCollision$.pipe(tap(() => this.playEdgeSound()));

  private onGatesSoundPlayer$: Observable<Collision> =
    this.collisions.onGatesCollision$.pipe(tap(() => this.playGatesSound()));

  private onShieldsSoundPlayer$: Observable<Collision> =
    this.collisions.onShieldsCollision$.pipe(
      tap(() => this.playShieldsSound())
    );

  onSoundPlayed$: Observable<void> = this.onSoundsEnabled$.pipe(
    switchMap((isEnabled: boolean) =>
      iif(
        () => isEnabled,
        combineLatest([
          this.onPaddleSoundPlayer$,
          this.onEdgeSoundPlayer$,
          this.onGatesSoundPlayer$,
          this.onShieldsSoundPlayer$,
        ]).pipe(switchMap(() => EMPTY)),
        EMPTY
      )
    )
  );

  private readonly soundsPath: string = 'assets/sounds';

  constructor(private collisions: CollisionService) {}

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

  private playSound(sound: string): void {
    const audio: HTMLAudioElement = new Audio(
      `${this.soundsPath}/${sound}.mp3`
    );
    audio.play();
  }
}
