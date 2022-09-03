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

  onRebound$: Observable<Collision[]> = combineLatest([
    this.edgeCollision$,
    this.paddleCollision$,
  ]);

  coordinates: Coordinates = { x: 0, y: 0 };

  constructor(private collision: CollisionService) {}

  init(): void {
    this.setRandomDirection();
  }

  private setRandomDirection(): void {
    this.coordinates = { x: 0, y: 0 };
    while (
      Math.abs(this.coordinates.x) <= 0.2 ||
      Math.abs(this.coordinates.x) >= 0.9
    ) {
      const headingX: number = randomFloatBetween(0, 2 * Math.PI);
      const randomY: number = randomFloatBetween(-1, 1) / 10;
      const randomX: number = Math.cos(headingX);
      this.coordinates = { x: randomX!, y: randomY };
    }
  }

  private adjustAfterPaddleCollision(): void {
    this.coordinates.x *= -1;
    const angleCorrection: number = this.getRandomCorrection();
    this.coordinates.y += angleCorrection * Math.sign(this.coordinates.y);
  }

  private adjustAfterEdgeCollision(): void {
    this.coordinates.y *= -1;
    const angleCorrection: number = this.getRandomCorrection();
    this.coordinates.x += angleCorrection * Math.sign(this.coordinates.x);
  }

  private getRandomCorrection(): number {
    return randomFloatBetween(0, 0.04);
  }
}
