import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
} from '@angular/core';
import { isIonicReady } from 'src/utilities';
import { HalfField } from '../enums';
import { PaddleController } from '../interfaces';
import { CollisionService } from '../services';

@Directive({
  selector: '[appBaseController]',
})
export class BaseControllerDirective
  implements AfterViewInit, PaddleController
{
  @Input() halfField!: HalfField;

  @HostBinding('style.left.px')
  x: number = 0;

  @HostBinding('style.top.px')
  y: number = 0;

  protected paddleHeight: number = 0;
  protected paddleWidth: number = 0;
  protected groundHeight: number = 0;
  protected groundWidth: number = 0;

  constructor(private ref: ElementRef, private collision: CollisionService) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.init();
  }

  private init(): void {
    this.collision.registerPaddle(this.ref.nativeElement);
    this.centerPaddle();
  }

  private centerPaddle(): void {
    this.setSizes();
    if (this.halfField === HalfField.Right) {
      this.x = this.groundWidth - this.paddleWidth;
    }
    this.y = this.groundHeight / 2 - this.paddleHeight / 2;
  }

  @HostListener('window:resize')
  private setSizes(): void {
    this.paddleHeight = this.ref.nativeElement.offsetHeight;
    this.paddleWidth = this.ref.nativeElement.offsetWidth;
    const ground: HTMLElement = this.ref.nativeElement.parentElement;
    this.groundHeight = ground.offsetHeight;
    this.groundWidth = ground.offsetWidth;
  }

  protected canMove(positionY: number): boolean {
    const bottomPosition: number = positionY + this.paddleHeight;
    return positionY >= 0 && bottomPosition <= this.groundHeight;
  }
}
