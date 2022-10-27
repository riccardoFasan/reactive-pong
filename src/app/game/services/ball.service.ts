import { Injectable } from '@angular/core';
import { LocatedRect } from 'src/utilities';
import { Coordinates } from '../models';
import { ElementsService } from './elements.service';

@Injectable({
  providedIn: 'root',
})
export class BallService {
  ball!: HTMLElement;
  position: Coordinates = { x: 0, y: 0 };

  constructor(private elements: ElementsService) {}

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
      left: this.position.x + this.elements.pagePadding,
      right: this.position.x + this.ballWidth + this.elements.pagePadding,
      top: this.position.y + this.elements.pagePadding,
      bottom: this.position.y + this.ballHeight + this.elements.pagePadding,
    };
  }

  registerBall(ball: HTMLElement): void {
    this.ball = ball;
  }
}
