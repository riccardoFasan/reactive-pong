import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GameControlsService {
  private lastTime: DOMHighResTimeStamp | undefined;

  private deltaStore$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  deltaChanged$: Observable<number> = this.deltaStore$.asObservable();

  start(): void {
    this.onFrameChanged();
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
