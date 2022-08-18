import { AfterViewInit, Directive, ElementRef, OnDestroy } from '@angular/core';
import { SubSink } from 'subsink';
import { PaddleController } from '../interfaces';
import { CollisionService, ControlsService } from '../services';
import { BaseControllerDirective } from './base-controller.directive';

@Directive({
  selector: '[appComputerController]',
})
export class ComputerControllerDirective
  extends BaseControllerDirective
  implements AfterViewInit, OnDestroy, PaddleController
{
  private readonly speed: number = 0.02;
  private subSink: SubSink = new SubSink();

  constructor(
    ref: ElementRef,
    collision: CollisionService,
    private controls: ControlsService
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

  private movePaddle(): void {
    this.subSink.sink = this.controls.deltaChanged$.subscribe(
      (delta: number) => {
        const halfHeight: number = this.paddleHeight / 2;
        const positionY: number =
          this.y + this.speed * delta * (this.ballY - halfHeight - this.y);
        if (this.canMove(positionY)) {
          this.y = positionY;
        }
      }
    );
  }

  private get ballY(): number {
    const ball: HTMLElement | null = document.querySelector('app-ball');
    if (ball === null) return 0;
    return parseInt(ball.style.top);
  }
}
