import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, share, throttleTime } from 'rxjs/operators';
import { areColliding } from 'src/utilities';
import { Collision } from '../enums';
import { ElementsService } from './elements.service';
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
      if (this.thereIsALeftShieldCollision) return Collision.LeftShield;
      if (this.thereIsARightShieldCollision) return Collision.RightShield;
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

  onShieldsCollision$: Observable<Collision> = this.collisionStore$.pipe(
    filter(
      (collision: Collision) =>
        collision === Collision.LeftShield ||
        collision === Collision.RightShield
    ),
    share()
  );

  constructor(
    private controls: GameControlsService,
    private elements: ElementsService
  ) {}

  private get thereIsALeftPaddleCollision(): boolean {
    if (!(this.elements.leftPaddle && this.elements.ball)) return false;
    return areColliding(this.elements.leftPaddle, this.elements.ball);
  }

  private get thereIsARightPaddleCollision(): boolean {
    if (!(this.elements.rightPaddle && this.elements.ball)) return false;
    return areColliding(this.elements.rightPaddle, this.elements.ball);
  }

  private get therIsAnEdgeCollision(): boolean {
    if (!(this.elements.ground && this.elements.ball)) return false;
    const bottomPosition: number =
      this.elements.ballY + this.elements.ballHeight;
    return !(
      this.elements.ballY >= 0 && bottomPosition <= this.elements.groundHeight
    );
  }

  private get thereIsAPlayer1GateCollision(): boolean {
    return this.elements.ballX < 0;
  }

  private get thereIsAPlayer2GateCollision(): boolean {
    return this.elements.groundWidth < this.elements.ballX;
  }

  private get thereIsALeftShieldCollision(): boolean {
    if (!(this.elements.leftShield && this.elements.ball)) return false;
    return areColliding(this.elements.leftShield, this.elements.ball);
  }

  private get thereIsARightShieldCollision(): boolean {
    if (!(this.elements.rightShield && this.elements.ball)) return false;
    return areColliding(this.elements.rightShield, this.elements.ball);
  }
}
