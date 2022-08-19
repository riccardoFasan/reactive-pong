import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { EMPTY, iif } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
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

  private ballWidth: number = 0;
  private ballHeight: number = 0;
  private groundHeight: number = 0;
  private groundWidth: number = 0;

  private direction: Coordinates = { x: 0, y: 0 };

  private thereWasACollision: boolean = false;
  private latestCollision: Collision = Collision.Edge;

  private subSink: SubSink = new SubSink();

  constructor(
    private ref: ElementRef,
    private collision: CollisionService,
    private controls: GameControlsService,
    private score: ScoreService,
    private level: LevelService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.onLevelChanged();
    this.onStatusChanged();
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
          iif(
            () => status === GameStatus.Running,
            this.controls.deltaChanged$.pipe(
              tap((delta: number) => {
                this.move(delta);
              })
            ),
            EMPTY
          )
        )
      )
      .subscribe();
  }

  private init(): void {
    this.setSizes();
    this.centerBall();
    this.collision.registerBall(this.ref.nativeElement);
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
    this.groundHeight = ground.offsetHeight;
    this.groundWidth = ground.offsetWidth;
  }

  private centerBall(): void {
    this.x = this.groundWidth / 2 - this.ballWidth / 2;
    this.y = this.groundHeight / 2 - this.ballHeight / 2;
  }

  private setRandomDirection(): void {
    while (
      Math.abs(this.direction.x) <= 0.2 ||
      Math.abs(this.direction.x) >= 0.9
    ) {
      const headingX: number = randomNumberBetween(0, 2 * Math.PI);
      const randomY: number = randomNumberBetween(-2, 2) / 10;
      const randomX: number = Math.cos(headingX);
      this.direction = { x: randomX!, y: randomY };
    }
  }

  private move(delta: number): void {
    this.checkForDirectionAdjustment(delta);

    if (!this.thereWasACollision) {
      const didAnyoneWin: boolean = this.didAnyoneWin();
      if (didAnyoneWin) {
        this.addPoints();
        this.init();
        return;
      }
    }

    this.x += this.direction.x * this.currentSpeed * delta;
    this.y += this.direction.y * this.currentSpeed * delta;
  }

  private didAnyoneWin(): boolean {
    return this.groundWidth <= this.x || this.x < 0;
  }

  private addPoints(): void {
    const player: Player =
      this.groundWidth <= this.x ? Player.Player1 : Player.Player2;
    this.score.addPoint(player);
  }

  private checkForDirectionAdjustment(delta: number): void {
    if (
      (!this.thereWasACollision || this.latestCollision !== Collision.Paddle) &&
      this.collision.thereIsAPaddleCollision
    ) {
      this.direction.x *= -1;
      this.direction.y += 0.1 * Math.sign(this.direction.y);
      this.latestCollision = Collision.Paddle;
      this.thereWasACollision = true;
      this.increaseSpeed(delta * 1.25);
      return;
    }

    if (!this.thereWasACollision || this.latestCollision !== Collision.Edge) {
      const bottomPosition: number = this.y + this.ballHeight;
      if (!(this.y >= 0 && bottomPosition <= this.groundHeight)) {
        this.direction.y *= -1;
        this.direction.x += 0.1 * Math.sign(this.direction.x);
        this.latestCollision = Collision.Edge;
        this.thereWasACollision = true;
        this.increaseSpeed(delta);
        return;
      }
    }

    this.thereWasACollision = false;
  }

  private increaseSpeed(delta: number): void {
    if (this.currentSpeed < this.ball.maximumSpeed) {
      this.currentSpeed += this.ball.acceleration * delta;
    }
  }
}
