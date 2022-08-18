import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  HostListener,
  Input,
  OnDestroy,
} from '@angular/core';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { GameStatus, HalfField } from '../enums';
import { PaddleController } from '../interfaces';
import { CollisionService, GameControlsService } from '../services';

@Directive({
  selector: '[appBaseController]',
})
export class BaseControllerDirective
  implements AfterViewInit, OnDestroy, PaddleController
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

  protected subSink: SubSink = new SubSink();

  constructor(
    private ref: ElementRef,
    private collision: CollisionService,
    protected controls: GameControlsService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.collision.registerPaddle(this.ref.nativeElement);
    this.centerPaddle();
    this.onStatusChanged();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private onStatusChanged(): void {
    this.subSink.sink = this.controls.statusChanged$.subscribe(
      (status: GameStatus) => {
        if (status === GameStatus.Stopped) {
          this.centerPaddle();
        }
      }
    );
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
