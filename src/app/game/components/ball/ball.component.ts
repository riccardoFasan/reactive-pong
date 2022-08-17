import {
  AfterViewInit,
  Component,
  ElementRef,
  HostBinding,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { isIonicReady, randomNumberBetween } from 'src/utilities';
import { SubSink } from 'subsink';
import { EventName, Player } from '../../enums';

import { Coordinates } from '../../models/coordinates.model';
import {
  CollisionService,
  ControlsService,
  EventBusService,
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

  private readonly startingSpeed: number = 0.025;
  private readonly speedIncrease: number = 0.00001;

  currentSpeed: number = this.startingSpeed;

  private subSink: SubSink = new SubSink();

  constructor(
    private ref: ElementRef,
    private collision: CollisionService,
    private bus: EventBusService,
    private controls: ControlsService,
    private score: ScoreService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.init();
    this.onFrameUpdated();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private init(): void {
    this.setSizes();
    this.centerBall();
    this.collision.registerBall(this.ref.nativeElement);
    this.setRandomDirection();
    this.currentSpeed = this.startingSpeed;
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

  private onFrameUpdated(): void {
    this.subSink.sink = this.controls.deltaChanged$.subscribe(
      (delta: number) => {
        this.move(delta);
      }
    );
  }

  private move(delta: number): void {
    const bottomPosition: number = this.y + this.ballHeight;
    if (!(this.y >= 0 && bottomPosition <= this.groundHeight)) {
      this.direction.y *= -1;
    }

    if (this.collision.thereIsACollision) {
      this.direction.x *= -1;
    }

    if (this.groundWidth <= this.x) {
      this.score.addPoint(Player.Player1);
      this.init();
    }

    if (this.x < 0) {
      this.score.addPoint(Player.Player2);
      this.init();
    }

    this.currentSpeed += this.speedIncrease * delta;
    this.x += this.direction.x * this.currentSpeed * delta;
    this.y += this.direction.y * this.currentSpeed * delta;
  }
}
