import { AfterViewInit, Directive, OnDestroy } from '@angular/core';
import { PaddleController } from '../interfaces';
import { BaseControllerDirective } from './base-controller.directive';

@Directive({
  selector: '[appComputerController]',
})
export class ComputerControllerDirective
  extends BaseControllerDirective
  implements AfterViewInit, OnDestroy, PaddleController
{
  private readonly speed: number = 0.02;
  private readonly inaccuracy: number = 0.75; // .75, .66, .575,

  private previousBallPositionY: number = this.ballY;

  override async ngAfterViewInit(): Promise<void> {
    super.ngAfterViewInit();
    this.movePaddle();
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
