import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { PaddleController } from '../interfaces';
import { CollisionService, GameControlsService } from '../services';
import { BaseControllerDirective } from './base-controller.directive';

@Directive({
  selector: '[appComputerController]',
})
export class ComputerControllerDirective
  extends BaseControllerDirective
  implements AfterViewInit, OnDestroy, PaddleController
{
  private readonly speed: number = 0.02;
  private readonly inaccuracy: number = 0.825; // .825, .75, .66, .5,

  private subSink: SubSink = new SubSink();

  private previousBallPositionY: number = this.ballY;

  constructor(
    ref: ElementRef,
    collision: CollisionService,
    private controls: GameControlsService
  ) {
    super(ref, collision);
  }

  override async ngAfterViewInit(): Promise<void> {
    super.ngAfterViewInit();
    this.movePaddle();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private get ballY(): number {
    const ball: HTMLElement | null = document.querySelector('app-ball');
    if (ball === null) return 0;
    return parseInt(ball.style.top);
  }

  private get isBallMovingDown(): boolean {
    if (this.previousBallPositionY === undefined) return false;
    return this.previousBallPositionY < this.ballY;
  }

  private movePaddle(): void {
    this.subSink.sink = this.controls.deltaChanged$.subscribe(
      (delta: number) => {
        const correctionFactor: number = this.paddleHeight * this.inaccuracy;
        const correctedPaddleHeight: number = this.isBallMovingDown
          ? correctionFactor
          : this.paddleHeight - correctionFactor;
        const movement: number = this.ballY - this.y - correctedPaddleHeight;
        const positionY: number = this.y + this.speed * delta * movement;
        if (this.canMove(positionY)) {
          this.y = positionY;
        }
        this.previousBallPositionY = this.ballY;
      }
    );
  }
}
