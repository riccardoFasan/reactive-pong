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
  @HostListener('window:touchmove', ['$event'])
  private onMove(e: TouchEvent): void {
    const touch: Touch = e.touches[0];
    if (touch) this.movePaddle(touch.clientY);
  }

  private movePaddle(positionY: number): void {
    if (this.canMove(positionY)) {
      this.y = positionY;
    }
  }
}
