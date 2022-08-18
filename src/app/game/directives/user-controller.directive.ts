import { AfterViewInit, Directive, HostListener } from '@angular/core';
import { PaddleController } from '../interfaces';
import { BaseControllerDirective } from './base-controller.directive';

@Directive({
  selector: '[appUserController]',
})
export class UserControllerDirective
  extends BaseControllerDirective
  implements AfterViewInit, PaddleController
{
  @HostListener('touchmove', ['$event'])
  private onTouchMove(e: TouchEvent): void {
    const touch: Touch = e.touches[0];
    if (touch) this.movePaddle(touch.clientY);
  }

  @HostListener('window:mousemove', ['$event'])
  private onMouseMove(e: MouseEvent): void {
    const halfHeight: number = this.paddleHeight / 2;
    this.movePaddle(e.clientY - halfHeight);
  }

  private get oneTenthPaddleHeight(): number {
    return this.paddleHeight / 10;
  }

  private movePaddle(positionY: number): void {
    if (this.canMove(positionY)) {
      this.y = positionY;
    }
  }
}
