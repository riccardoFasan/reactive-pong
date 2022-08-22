import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { combineLatest, EMPTY, iif, Observable, timer } from 'rxjs';
import { filter, map, switchMap, tap, throttleTime } from 'rxjs/operators';
import { isIonicReady, randomNumberBetween } from 'src/utilities';
import { SubSink } from 'subsink';
import { Collision, GameStatus, Player } from '../../enums';
import { Ball, LevelSettings } from '../../models';

import { Coordinates } from '../../models/coordinates.model';
import {
  CollisionService,
  GameControlsService,
  LevelService,
  ScoreService,
} from '../../services';
import { NORMAL_BALL } from '../../store';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss'],
})
export class BallComponent implements AfterViewInit, OnDestroy {
  @HostBinding('style.left.px')
  x: number = 0;

  @HostBinding('style.top.px')
  y: number = 0;

  private ball: Ball = NORMAL_BALL;

  currentSpeed: number = this.ball.baseSpeed;

  private direction: Coordinates = { x: 0, y: 0 };

  private ballWidth: number = 0;
  private ballHeight: number = 0;
  private groundHeight: number = 0;
  private groundWidth: number = 0;

  private subSink: SubSink = new SubSink();

  private readonly millisecondsBeforeKickStart: number = 750;

  private paddleCollision$: Observable<Collision> =
    this.collision.collisionChanged$.pipe(
      filter(
        (collision: Collision) =>
          collision === Collision.LeftPaddle ||
          collision === Collision.RightPaddle
      ),
      throttleTime(100),
      tap(() => {
        this.adjustAfterPaddleCollision();
      })
    );

  private edgeCollision$: Observable<Collision> =
    this.collision.collisionChanged$.pipe(
      filter((collision: Collision) => collision === Collision.Edge),
      throttleTime(100),
      tap(() => {
        this.adjustAfterEdgeCollision();
      })
    );

  private goalCollision$: Observable<Collision> =
    this.collision.collisionChanged$.pipe(
      filter(
        (collision: Collision) =>
          collision === Collision.Player1Gate ||
          collision === Collision.Player2Gate
      ),
      tap((collision: Collision) => {
        this.adjustAfterGoal(collision);
      })
    );

  private onCollision$: Observable<Collision[]> = combineLatest([
    this.edgeCollision$,
    this.paddleCollision$,
    this.goalCollision$,
  ]);

  constructor(
    private ref: ElementRef,
    private collision: CollisionService,
    private controls: GameControlsService,
    private score: ScoreService,
    private level: LevelService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.collision.registerBall(this.ref.nativeElement);
    this.onLevelChanged();
    this.onStatusChanged();
    this.onCollisionChanged();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private onLevelChanged(): void {
    this.subSink.sink = this.level.levelChanged$
      .pipe(map((level: LevelSettings) => level.ball))
      .subscribe((ball: Ball) => {
        this.ball = ball;
        this.currentSpeed = this.ball.baseSpeed;
      });
  }

  private onStatusChanged(): void {
    this.subSink.sink = this.controls.statusChanged$
      .pipe(
        tap((status: GameStatus) => {
          if (status === GameStatus.Stopped) {
            this.init();
          }
        }),
        switchMap((status: GameStatus) =>
          // ! do not use filter operator
          iif(
            () => status === GameStatus.Running,
            timer(this.millisecondsBeforeKickStart).pipe(
              switchMap(() => this.controls.timer$.pipe(tap(() => this.move())))
            ),
            EMPTY
          )
        )
      )
      .subscribe();
  }

  private onCollisionChanged(): void {
    this.subSink.sink = this.onCollision$.subscribe();
  }

  private init(): void {
    this.setSizes();
    this.centerBall();
    this.setRandomDirection();
    this.currentSpeed = randomNumberBetween(
      this.ball.baseSpeed,
      this.ball.maximumSpeed
    );
  }

  @HostListener('window:resize')
  private setSizes(): void {
    this.ballWidth = this.ref.nativeElement.offsetWidth;
    this.ballHeight = this.ref.nativeElement.offsetHeight;
    const ground: HTMLElement = this.ref.nativeElement.parentElement;
    this.groundHeight = ground.clientHeight;
    this.groundWidth = ground.clientWidth;
  }

  private centerBall(): void {
    this.x = this.groundWidth / 2 - this.ballWidth / 2;
    this.y = this.groundHeight / 2 - this.ballHeight / 2;
  }

  private setRandomDirection(): void {
    this.direction = { x: 0, y: 0 };
    while (
      Math.abs(this.direction.x) <= 0.2 ||
      Math.abs(this.direction.x) >= 0.9
    ) {
      const headingX: number = randomNumberBetween(0, 2 * Math.PI);
      const randomY: number = randomNumberBetween(-1, 1) / 10;
      const randomX: number = Math.cos(headingX);
      this.direction = { x: randomX!, y: randomY };
    }
  }

  private move(): void {
    this.increaseSpeed();
    this.x += this.direction.x * this.currentSpeed;
    this.y += this.direction.y * this.currentSpeed;
  }

  private adjustAfterPaddleCollision(): void {
    this.direction.x *= -1;
    this.direction.y += 0.033 * Math.sign(this.direction.y);
  }

  private adjustAfterEdgeCollision(): void {
    this.direction.y *= -1;
    this.direction.x += 0.033 * Math.sign(this.direction.x);
  }

  private adjustAfterGoal(collision: Collision): void {
    this.controls.pause();
    const player: Player =
      collision === Collision.Player1Gate ? Player.Player2 : Player.Player1;
    this.score.addPoint(player);
    this.init();
    this.controls.resume();
  }

  private increaseSpeed(): void {
    if (this.currentSpeed < this.ball.maximumSpeed) {
      this.currentSpeed += this.ball.acceleration;
    }
  }
}
