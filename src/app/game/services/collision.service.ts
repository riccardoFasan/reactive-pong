import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, share, throttleTime } from 'rxjs/operators';
import { areColliding } from 'src/utilities';
import { Collision } from '../enums';
import { GameControlsService } from './game-controls.service';

@Injectable({
  providedIn: 'root',
})
export class CollisionService {
  private collisionStore$: Observable<Collision> = this.controls.timer$.pipe(
    map(() => {
      if (this.thereIsALeftPaddleCollision) return Collision.LeftPaddle;
      if (this.thereIsARightPaddleCollision) return Collision.RightPaddle;
      if (this.therIsAnEdgeCollision) return Collision.Edge;
      if (this.thereIsAPlayer1GateCollision) return Collision.Player1Gate;
      if (this.thereIsAPlayer2GateCollision) return Collision.Player2Gate;
      return Collision.None;
    }),
    share()
  );

  onPaddleCollision$: Observable<Collision> = this.collisionStore$.pipe(
    filter(
      (collision: Collision) =>
        collision === Collision.LeftPaddle ||
        collision === Collision.RightPaddle
    ),
    throttleTime(100),
    share()
  );

  onEdgeCollision$: Observable<Collision> = this.collisionStore$.pipe(
    filter((collision: Collision) => collision === Collision.Edge),
    throttleTime(100),
    share()
  );

  onGatesCollision$: Observable<Collision> = this.collisionStore$.pipe(
    filter(
      (collision: Collision) =>
        collision === Collision.Player1Gate ||
        collision === Collision.Player2Gate
    ),
    share()
  );

  private leftPaddle!: HTMLElement;
  private rightPaddle!: HTMLElement;
  private ball!: HTMLElement;
  private ground!: HTMLElement;

  constructor(private controls: GameControlsService) {}

  registerLeftPaddle(paddle: HTMLElement): void {
    this.leftPaddle = paddle;
  }

  registerRightPaddle(paddle: HTMLElement): void {
    this.rightPaddle = paddle;
  }

  registerBall(ball: HTMLElement): void {
    this.ball = ball;
  }

  registerGround(ground: HTMLElement): void {
    this.ground = ground;
  }

  private get thereIsALeftPaddleCollision(): boolean {
    if (!(this.leftPaddle && this.ball)) return false;
    return areColliding(this.leftPaddle, this.ball);
  }

  private get thereIsARightPaddleCollision(): boolean {
    if (!(this.rightPaddle && this.ball)) return false;
    return areColliding(this.rightPaddle, this.ball);
  }

  private get therIsAnEdgeCollision(): boolean {
    if (!(this.ground && this.ball)) return false;
    const bottomPosition: number = this.ballY + this.ballHeight;
    return !(this.ballY >= 0 && bottomPosition <= this.groundHeight);
  }

  private get thereIsAPlayer1GateCollision(): boolean {
    return this.ballX < 0;
  }

  private get thereIsAPlayer2GateCollision(): boolean {
    return this.groundWidth < this.ballX;
  }

  private get ballHeight(): number {
    if (!this.ball) return 0;
    return this.ball.offsetHeight;
  }

  private get ballY(): number {
    if (!this.ball) return 0;
    return parseInt(this.ball.style.top);
  }

  private get ballX(): number {
    if (!this.ball) return 0;
    return parseInt(this.ball.style.left);
  }

  private get groundHeight(): number {
    if (!this.ground) return 0;
    return this.ground.offsetHeight;
  }

  private get groundWidth(): number {
    if (!this.ground) return 0;
    return this.ground.offsetWidth;
  }
}
