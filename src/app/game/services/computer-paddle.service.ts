import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PaddleController } from '../interfaces';
import { SubSink } from 'subsink';

@Injectable()
export class ComputerPaddleService implements PaddleController {
  x$: BehaviorSubject<number> = new BehaviorSubject<number>(0);
  y$: BehaviorSubject<number> = new BehaviorSubject<number>(0);

  private subSink: SubSink = new SubSink();

  constructor() {}

  start(x: number, y: number): void {
    this.x$.next(x);
    this.y$.next(y);
  }

  stop(): void {
    this.subSink.unsubscribe();
  }
}
