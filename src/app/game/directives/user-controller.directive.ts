import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { Platform } from '@ionic/angular';
import { PaddleController } from '../interfaces';
import { CollisionService, GameControlsService } from '../services';
import { BaseControllerDirective } from './base-controller.directive';

@Directive({
  selector: '[appUserController]',
})
export class UserControllerDirective
  extends BaseControllerDirective
  implements AfterViewInit, OnDestroy, PaddleController
{
  constructor(
    collision: CollisionService,
    ref: ElementRef,
    controls: GameControlsService,
    private platform: Platform
  ) {
    super(collision, ref, controls);
  }

  @HostListener('touchmove', ['$event'])
  @HostListener('window:mousemove', ['$event'])
  private onMove(e: Event): void {
    if (e instanceof TouchEvent) {
      const touch: Touch = e.touches[0];
      if (touch) this.movePaddle(touch.clientY);
      return;
    }
    if (!this.platform.is('mobile')) {
      const halfHeight: number = this.paddleHeight / 2;
      this.movePaddle((e as MouseEvent).clientY - halfHeight);
    }
  }

  private movePaddle(positionY: number): void {
    if (this.canMove(positionY)) {
      this.y = positionY;
    }
  }
}
