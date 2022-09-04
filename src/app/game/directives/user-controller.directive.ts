import {
  AfterViewInit,
  Directive,
  HostListener,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { GameStatus } from '../enums';
import { PaddleController } from '../interfaces';
import { BaseControllerDirective } from './base-controller.directive';

@Directive({
  selector: '[appUserController]',
})
export class UserControllerDirective
  extends BaseControllerDirective
  implements AfterViewInit, OnChanges, OnDestroy, PaddleController
{
  @HostListener('window:touchmove', ['$event'])
  private onMove(e: TouchEvent): void {
    if (this.controls.currentStatus === GameStatus.Running) {
      const touch: Touch = e.touches[0];
      if (touch) {
        const halfHeight: number = this.height / 2;
        this.movePaddle(touch.clientY - halfHeight);
      }
    }
  }

  private movePaddle(positionY: number): void {
    if (this.canMove(positionY)) {
      this.y = positionY;
    }
  }
}
