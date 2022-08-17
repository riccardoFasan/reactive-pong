import { Injectable } from '@angular/core';
import { areColliding } from 'src/utilities';

@Injectable({
  providedIn: 'root',
})
export class CollisionService {
  private paddles: HTMLElement[] = [];
  private ball!: HTMLElement;

  constructor() {}

  get thereIsACollision(): boolean {
    if (!this.ball) return false;
    return this.paddles.some((paddle) => areColliding(paddle, this.ball));
  }

  registerPaddle(paddle: HTMLElement): void {
    this.paddles = [...this.paddles, paddle];
  }

  registerBall(ball: HTMLElement): void {
    this.ball = ball;
  }
}
