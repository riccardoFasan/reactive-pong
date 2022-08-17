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
    this.movePaddle(e.clientY);
  }

  @HostListener('window:keydown.arrowdown', ['$event'])
  @HostListener('window:keydown.arrowup', ['$event'])
  private onKeyDown(e: KeyboardEvent): void {
    let movement: number = this.oneTenthPaddleHeight * this.ball.speed;
    if (e.key === 'ArrowUp') {
      movement *= -1;
    }
    const positionY: number = this.y + movement;
    this.movePaddle(positionY);
  }

  private get oneTenthPaddleHeight(): number {
    return this.paddleHeight / 10;
  }

  private movePaddle(positionY: number): void {
    if (this.canMove(positionY)) {
      this.y = positionY;
    }
  }

  private canMove(positionY: number): boolean {
    const bottomPosition: number = positionY + this.paddleHeight;
    return positionY >= 0 && bottomPosition <= this.fieldHeight;
  }
}
