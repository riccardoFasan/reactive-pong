import { AfterViewInit, Component, ElementRef, OnDestroy } from '@angular/core';
import { combineLatest, EMPTY, iif, Observable, timer } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { Collision, GameStatus } from '../../enums';
import { Ball, LevelSettings } from '../../models';
import {
  BallDirectionService,
  CollisionService,
  GameControlsService,
  LevelService,
  ElementsService,
  BallService,
} from '../../services';
import { NORMAL_BALL } from '../../store';

@Component({
  selector: 'app-ball',
  templateUrl: './ball.component.html',
  styleUrls: ['./ball.component.scss'],
})
export class BallComponent implements AfterViewInit, OnDestroy {
  private ball: Ball = NORMAL_BALL;

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
    private ballElement: BallService,
    private elements: ElementsService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.ballElement.registerBall(this.ref.nativeElement);
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
      });
  }

  private onStatusChanged(): void {
    this.subSink.sink = this.controls.statusChanged$
      .pipe(
        tap((status: GameStatus) => {
          if (status === GameStatus.Stopped) this.init();
        }),
        switchMap((status: GameStatus) =>
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
  }

  private centerBall(): void {
    this.ballElement.position.x =
      this.elements.groundWidth / 2 - this.ballElement.ballWidth / 2;
    this.ballElement.position.y =
      this.elements.groundHeight / 2 - this.ballElement.ballHeight / 2;
    this.setPosition();
  }

  private resetAfterGoal(): void {
    this.init();
  }

  private move(): void {
    this.ballElement.position.x +=
      this.direction.trajectory.x * this.ball.speed;
    this.ballElement.position.y +=
      this.direction.trajectory.y * this.ball.speed;
    this.setPosition();
  }

  private setPosition(): void {
    const x: number =
      this.ballElement.position.x -
      (this.elements.groundWidth / 2 - this.ballElement.ballWidth / 2);
    const y: number =
      this.ballElement.position.y -
      (this.elements.groundHeight / 2 - this.ballElement.ballHeight / 2);
    this.ref.nativeElement.style.setProperty('--x', `${x}px`);
    this.ref.nativeElement.style.setProperty('--y', `${y}px`);
  }
}
