import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { filter, map, share, throttleTime } from 'rxjs/operators';
import { areColliding } from 'src/utilities';
import { Collision } from '../enums';
import { BallService, ElementsService, GameControlsService } from '.';

@Injectable({
  providedIn: 'root',
})
export class CollisionService {
  private collisionStore$: Observable<Collision> = this.controls.timer$.pipe(
    map(() => {
      if (this.thereIsALeftPaddleCollision) return Collision.LeftPaddle;
      if (this.thereIsARightPaddleCollision) return Collision.RightPaddle;
      if (this.therIsAnEdgeCollision) return Collision.Edge;
      if (this.thereIsAPlayerLeftGateCollision) return Collision.PlayerLeftGate;
      if (this.thereIsAPlayerRightGateCollision)
        return Collision.PlayerRightGate;
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
        collision === Collision.PlayerLeftGate ||
        collision === Collision.PlayerRightGate
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
    private elements: ElementsService,
    private ballElement: BallService
  ) {}

  private get thereIsALeftPaddleCollision(): boolean {
    if (!this.elements.leftPaddle) return false;
    return areColliding(
      this.elements.leftPaddleRect,
      this.ballElement.ballRect
    );
  }

  private get thereIsARightPaddleCollision(): boolean {
    if (!this.elements.rightPaddle) return false;
    return areColliding(
      this.elements.rightPaddleRect,
      this.ballElement.ballRect
    );
  }

  private get therIsAnEdgeCollision(): boolean {
    if (!(this.elements.ground && this.ballElement.ball)) return false;
    return !(
      this.ballElement.ballRect.top >= this.elements.pagePadding &&
      this.ballElement.ballRect.bottom <=
        this.elements.groundHeight + this.elements.pagePadding
    );
  }

  private get thereIsAPlayerLeftGateCollision(): boolean {
    return this.ballElement.ballRect.left < this.elements.pagePadding;
  }

  private get thereIsAPlayerRightGateCollision(): boolean {
    return (
      this.elements.groundWidth <
      this.ballElement.ballRect.right + this.elements.pagePadding
    );
  }

  private get thereIsALeftShieldCollision(): boolean {
    if (!(this.elements.leftShield && this.ballElement.ball)) return false;
    return areColliding(
      this.elements.leftShieldRect!,
      this.ballElement.ballRect
    );
  }

  private get thereIsARightShieldCollision(): boolean {
    if (!(this.elements.rightShield && this.ballElement.ball)) return false;
    return areColliding(
      this.elements.rightShieldRect!,
      this.ballElement.ballRect
    );
  }
}
