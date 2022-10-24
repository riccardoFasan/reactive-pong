import { Injectable } from '@angular/core';
import { LocatedRect } from 'src/utilities';
import { Coordinates } from '../models';

@Injectable({
  providedIn: 'root',
})
export class BallService {
  ball!: HTMLElement;
  position: Coordinates = { x: 0, y: 0 };

  get ballHeight(): number {
    if (!this.ball) return 0;
    return this.ball.offsetHeight;
  }

  get ballWidth(): number {
    if (!this.ball) return 0;
    return this.ball.offsetWidth;
  }

  get ballRect(): LocatedRect {
    return {
      left: this.position.x,
      right: this.position.x + this.ballWidth,
      top: this.position.y,
      bottom: this.position.y + this.ballHeight,
    };
  }

  registerBall(ball: HTMLElement): void {
    this.ball = ball;
  }
}
