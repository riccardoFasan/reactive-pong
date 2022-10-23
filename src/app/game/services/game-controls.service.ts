import { Injectable } from '@angular/core';
import { BehaviorSubject, interval, Observable } from 'rxjs';
import { share } from 'rxjs/operators';
import { GameStatus } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class GameControlsService {
  timer$: Observable<number> = interval(20).pipe(share());

  private statusStore$: BehaviorSubject<GameStatus> =
    new BehaviorSubject<GameStatus>(GameStatus.Stopped);
  statusChanged$: Observable<GameStatus> = this.statusStore$.asObservable();

  get currentStatus(): GameStatus {
    return this.statusStore$.getValue();
  }

  start(): void {
    this.status = GameStatus.Running;
  }

  stop(): void {
    this.status = GameStatus.Stopped;
  }

  pause(): void {
    if (this.status === GameStatus.Stopped) return;
    this.status = GameStatus.Paused;
  }

  resume(): void {
    if (this.status === GameStatus.Stopped) return;
    this.status = GameStatus.Running;
  }

  private get status(): GameStatus {
    return this.statusStore$.getValue();
  }

  private set status(status: GameStatus) {
    this.statusStore$.next(status);
  }
}
