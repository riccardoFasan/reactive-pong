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
import { BallService } from '../services';

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
  protected fieldHeight: number = 0;
  protected fieldWidth: number = 0;

  constructor(private ref: ElementRef, protected ball: BallService) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.centerPaddle();
  }

  private centerPaddle(): void {
    this.setSizes();
    if (this.halfField === HalfField.Right) {
      this.x = this.fieldWidth - this.paddleWidth;
    }
    this.y = this.fieldHeight / 2 - this.paddleHeight / 2;
  }

  @HostListener('window:resize')
  private setSizes(): void {
    this.paddleHeight = this.ref.nativeElement.offsetHeight;
    this.paddleWidth = this.ref.nativeElement.offsetWidth;
    const field: HTMLElement = this.ref.nativeElement.parentElement;
    this.fieldHeight = field.offsetHeight;
    this.fieldWidth = field.offsetWidth;
  }
}
