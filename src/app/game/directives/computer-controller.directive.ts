import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
} from '@angular/core';
import { isIonicReady } from 'src/utilities';
import { PaddleController } from '../interfaces';

@Directive({
  selector: '[appComputerController]',
})
export class ComputerControllerDirective
  implements AfterViewInit, PaddleController
{
  @HostBinding('style.left.px')
  x: number = 0;

  @HostBinding('style.top.px')
  y: number = 0;

  private paddleHeight: number = 0;
  private paddleWidth: number = 0;
  private fieldHeight: number = 0;
  private fieldWidth: number = 0;

  constructor(private ref: ElementRef) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.centerPaddle();
  }

  private centerPaddle(): void {
    this.setSizes();
    this.x = this.fieldWidth - this.paddleWidth;
    this.y = this.fieldHeight / 2 - this.paddleHeight / 2;
  }

  @HostListener('window:resize')
  private setSizes(): void {
    this.paddleHeight = this.ref.nativeElement.offsetHeight;
    this.paddleWidth = this.ref.nativeElement.offsetWidth;
    const field: HTMLElement =
      this.ref.nativeElement.parentElement.parentElement;
    this.fieldHeight = field.offsetHeight;
    this.fieldWidth = field.offsetWidth;
  }
}
