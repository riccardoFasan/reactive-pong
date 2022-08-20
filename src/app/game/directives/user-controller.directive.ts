import {
  AfterViewInit,
  Directive,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { PaddleController } from '../interfaces';
import { BaseControllerDirective } from './base-controller.directive';

@Directive({
  selector: '[appUserController]',
})
export class UserControllerDirective
  extends BaseControllerDirective
  implements AfterViewInit, OnDestroy, PaddleController
{
  @HostListener('touchmove', ['$event'])
  @HostListener('window:mousemove', ['$event'])
  private onMove(e: Event): void {
    if (e instanceof TouchEvent) {
      const touch: Touch = e.touches[0];
      if (touch) this.movePaddle(touch.clientY);
      return;
    }
    const halfHeight: number = this.paddleHeight / 2;
    this.movePaddle((e as MouseEvent).clientY - halfHeight);
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
