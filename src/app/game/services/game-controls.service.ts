import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { GameStatus } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class GameControlsService {
  private lastTime: DOMHighResTimeStamp | undefined;

  private deltaStore$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  deltaChanged$: Observable<number> = this.deltaStore$.asObservable();

  private statusStore$: BehaviorSubject<GameStatus> =
    new BehaviorSubject<GameStatus>(GameStatus.Stopped);
  statusChanged$: Observable<GameStatus> = this.statusStore$.asObservable();

  start(): void {
    this.statusStore$.next(GameStatus.Running);
    this.onFrameChanged();
  }

  stop(): void {
    this.statusStore$.next(GameStatus.Stopped);
  }

  pause(): void {
    this.statusStore$.next(GameStatus.Paused);
  }

  resume(): void {
    this.statusStore$.next(GameStatus.Running);
  }

  private onFrameChanged(): void {
    window.requestAnimationFrame((time: DOMHighResTimeStamp) => {
      this.update(time);
    });
  }

  private update(time: DOMHighResTimeStamp): void {
    if (this.lastTime !== undefined) {
      const delta: number = time - this.lastTime;
      this.deltaStore$.next(delta);
    }
    this.lastTime = time;
    this.onFrameChanged();
  }
}
