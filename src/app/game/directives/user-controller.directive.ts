import {
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
} from '@angular/core';
import { isIonicReady } from 'src/utilities';
import { PaddleController } from '../interfaces';
import { BallService } from '../services';

@Directive({
  selector: '[appUserController]',
})
export class UserControllerDirective implements PaddleController {
  @HostBinding('style.left.px')
  x: number = 0;

  @HostBinding('style.top.px')
  y: number = 0;

  private paddleHeight: number = 0;
  private fieldHeight: number = 0;

  constructor(private ref: ElementRef, private ball: BallService) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.centerPaddle();
  }

  private centerPaddle(): void {
    this.setSizes();
    this.y = this.fieldHeight / 2 - this.paddleHeight / 2;
  }

  @HostListener('window:resize')
  private setSizes(): void {
    this.paddleHeight = this.ref.nativeElement.offsetHeight;
    const parent: HTMLElement =
      this.ref.nativeElement.parentElement.parentElement;
    this.fieldHeight = parent.offsetHeight;
  }

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
