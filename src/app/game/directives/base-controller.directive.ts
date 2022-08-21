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

  private readonly pixelsFromEdges: number = 20;

  constructor(
    private collision: CollisionService,
    private ref: ElementRef,
    protected controls: GameControlsService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.registerPaddle();
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

  private registerPaddle(): void {
    if (this.halfField === HalfField.Left) {
      this.collision.registerLeftPaddle(this.ref.nativeElement);
      return;
    }
    this.collision.registerRightPaddle(this.ref.nativeElement);
  }

  private centerPaddle(): void {
    this.setSizes();
    if (this.halfField === HalfField.Right) {
      this.x = this.groundWidth - this.paddleWidth - this.pixelsFromEdges;
    } else {
      this.x = this.pixelsFromEdges;
    }
    this.y = this.groundHeight / 2 - this.paddleHeight / 2;
  }

  @HostListener('window:resize')
  private setSizes(): void {
    this.paddleHeight = this.ref.nativeElement.offsetHeight;
    this.paddleWidth = this.ref.nativeElement.offsetWidth;
    const ground: HTMLElement = this.ref.nativeElement.parentElement;
    this.groundHeight = ground.clientHeight;
    this.groundWidth = ground.clientWidth;
  }

  protected canMove(positionY: number): boolean {
    const bottomPosition: number = positionY + this.paddleHeight;
    return positionY >= 0 && bottomPosition <= this.groundHeight;
  }
}
