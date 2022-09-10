import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  OnDestroy,
} from '@angular/core';
import { combineLatest, EMPTY, iif, Observable, timer } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { isIonicReady, randomFloatBetween } from 'src/utilities';
import { SubSink } from 'subsink';
import { Collision, GameStatus } from '../../enums';
import { Ball, LevelSettings } from '../../models';
import {
  BallDirectionService,
  CollisionService,
  GameControlsService,
  LevelService,
  ElementsService,
} from '../../services';
import { NORMAL_BALL } from '../../store';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss'],
})
export class BallComponent implements AfterViewInit, OnDestroy {
  @HostBinding('style.left.px')
  get x(): number {
    return this.direction.position.x;
  }

  @HostBinding('style.top.px')
  get y(): number {
    return this.direction.position.y;
  }

  private ball: Ball = NORMAL_BALL;
  currentSpeed: number = this.ball.baseSpeed;

  private subSink: SubSink = new SubSink();

  private readonly millisecondsBeforeKickStart: number = 750;

  private onGatesCollision$: Observable<Collision> =
    this.collision.onGatesCollision$.pipe(tap(() => this.resetAfterGoal()));

  constructor(
    private ref: ElementRef,
    private collision: CollisionService,
    private controls: GameControlsService,
    private level: LevelService,
    private direction: BallDirectionService,
    private elements: ElementsService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.elements.registerBall(this.ref.nativeElement);
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
    this.subSink.sink = combineLatest([
      this.onGatesCollision$,
      this.direction.onRebound$,
    ]).subscribe();
  }

  private init(): void {
    this.centerBall();
    this.direction.init();
    this.currentSpeed = randomFloatBetween(
      this.ball.baseSpeed,
      this.ball.maximumSpeed
    );
  }

  private centerBall(): void {
    this.direction.position.x =
      this.elements.groundWidth / 2 - this.elements.ballWidth / 2;
    this.direction.position.y =
      this.elements.groundHeight / 2 - this.elements.ballHeight / 2;
  }

  private resetAfterGoal(): void {
    this.init();
  }

  private move(): void {
    this.increaseSpeed();
    this.direction.position.x +=
      this.direction.trajectory.x * this.currentSpeed;
    this.direction.position.y +=
      this.direction.trajectory.y * this.currentSpeed;
  }

  private increaseSpeed(): void {
    if (this.currentSpeed < this.ball.maximumSpeed) {
      this.currentSpeed += this.ball.acceleration;
    }
  }
}
