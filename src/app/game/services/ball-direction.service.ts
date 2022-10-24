import { Injectable } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { randomFloatBetween } from 'src/utilities';
import { Collision } from '../enums';
import { Coordinates } from '../models';
import { CollisionService } from './collision.service';

@Injectable({
  providedIn: 'root',
})
export class BallDirectionService {
  private paddleCollision$: Observable<Collision> =
    this.collision.onPaddleCollision$.pipe(
      tap(() => this.adjustAfterPaddleCollision())
    );

  private edgeCollision$: Observable<Collision> =
    this.collision.onEdgeCollision$.pipe(
      tap(() => this.adjustAfterEdgeCollision())
    );

  private shieldsCollision$: Observable<Collision> =
    this.collision.onShieldsCollision$.pipe(
      tap(() => this.adjustAfterShieldCollision())
    );

  onRebound$: Observable<Collision[]> = combineLatest([
    this.edgeCollision$,
    this.paddleCollision$,
    this.shieldsCollision$,
  ]);

  trajectory: Coordinates = { x: 0, y: 0 };
  position: Coordinates = { x: 0, y: 0 };

  constructor(private collision: CollisionService) {}

  init(): void {
    this.setRandomDirection();
  }

  get isBallGoingRight(): boolean {
    return Math.sign(this.trajectory.x) === 1;
  }

  get isBallGoingDown(): boolean {
    return Math.sign(this.trajectory.y) === 1;
  }

  private setRandomDirection(): void {
    this.trajectory = { x: 0, y: 0 };
    while (
      Math.abs(this.trajectory.x) <= 0.2 ||
      Math.abs(this.trajectory.x) >= 0.9
    ) {
      const headingX: number = randomFloatBetween(0, 2 * Math.PI);
      const randomY: number = randomFloatBetween(-1, 1) / 10;
      const randomX: number = Math.cos(headingX);
      this.trajectory = { x: randomX!, y: randomY };
    }
  }

  private adjustAfterPaddleCollision(): void {
    this.trajectory.x *= -1;
    const angleCorrection: number = this.getRandomCorrection();
    this.trajectory.y += angleCorrection * Math.sign(this.trajectory.y);
  }

  private adjustAfterShieldCollision(): void {
    this.trajectory.x *= -1;
    const angleCorrection: number = this.getRandomCorrection();
    this.trajectory.y += angleCorrection * Math.sign(this.trajectory.y);
  }

  private adjustAfterEdgeCollision(): void {
    this.trajectory.y *= -1;
    const angleCorrection: number = this.getRandomCorrection();
    this.trajectory.x += angleCorrection * Math.sign(this.trajectory.x);
  }

  private getRandomCorrection(): number {
    return randomFloatBetween(0, 0.04);
  }
}
