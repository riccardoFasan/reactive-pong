import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { EMPTY, iif } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { isIonicReady, randomNumberBetween } from 'src/utilities';
import { SubSink } from 'subsink';
import { GameStatus, Player } from '../../enums';

import { Coordinates } from '../../models/coordinates.model';
import {
  CollisionService,
  GameControlsService,
  ScoreService,
} from '../../services';

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

  private ballWidth: number = 0;
  private ballHeight: number = 0;
  private groundHeight: number = 0;
  private groundWidth: number = 0;

  private direction: Coordinates = { x: 0, y: 0 };

  private readonly startingSpeed: number = 0.075;
  private readonly speedIncrease: number = 0.0005; // 0.0005, 0.00075 and 0.001
  private readonly maximumSpeed: number = 0.25; // .25, .33 and .41

  currentSpeed: number = this.startingSpeed;

  private subSink: SubSink = new SubSink();

  constructor(
    private ref: ElementRef,
    private collision: CollisionService,
    private controls: GameControlsService,
    private score: ScoreService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.onStatusChanged();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private onStatusChanged(): void {
    this.subSink.sink = this.controls.statusChanged$
      .pipe(
        tap(() => {
          this.init();
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
      this.startingSpeed,
      this.maximumSpeed
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
      const heading: number = randomNumberBetween(0, 2 * Math.PI);
      this.direction = { x: Math.cos(heading), y: Math.sin(heading) };
    }
  }

  private move(delta: number): void {
    const thereWasACollision: boolean = this.thereWasACollision();

    if (thereWasACollision) {
      this.checkForDirectionAdjustment(delta);
    }

    if (!thereWasACollision) {
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

  private thereWasACollision(): boolean {
    return (
      this.collision.thereIsACollision ||
      !(this.y >= 0 && this.y + this.ballHeight <= this.groundHeight)
    );
  }

  private checkForDirectionAdjustment(delta: number): void {
    if (this.collision.thereIsACollision) {
      this.direction.x *= -1;
      this.direction.y += 0.1 * Math.sign(this.direction.y);
      this.increaseSpeed(delta * 1.5);
    }

    const bottomPosition: number = this.y + this.ballHeight;
    if (!(this.y >= 0 && bottomPosition <= this.groundHeight)) {
      this.direction.y *= -1;
      this.direction.x += 0.1 * Math.sign(this.direction.x);
      this.increaseSpeed(delta);
    }
  }

  private increaseSpeed(delta: number): void {
    if (this.currentSpeed < this.maximumSpeed) {
      this.currentSpeed += this.speedIncrease * delta;
    }
  }
}
