import {
  AfterViewInit,
  Directive,
  ElementRef,
  HostBinding,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
} from '@angular/core';
import { filter } from 'rxjs/operators';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { GameStatus, HalfField } from '../enums';
import { PaddleController } from '../interfaces';
import {
  CollisionService,
  GameControlsService,
  SizesService,
} from '../services';

@Directive({
  selector: '[appBaseController]',
})
export class BaseControllerDirective
  implements AfterViewInit, OnChanges, OnDestroy, PaddleController
{
  @Input() halfField!: HalfField;

  @HostBinding('style.left.px')
  x: number = 0;

  @HostBinding('style.top.px')
  y: number = 0;

  protected subSink: SubSink = new SubSink();

  constructor(
    private collision: CollisionService,
    private ref: ElementRef,
    protected controls: GameControlsService,
    protected sizes: SizesService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.sizes.updateSizes();
    this.registerPaddle();
    this.onStatusChanged();
    this.centerPaddle();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['halfField']) {
      this.registerPaddle();
      this.centerPaddle();
    }
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private registerPaddle(): void {
    if (this.halfField === HalfField.Left) {
      this.collision.registerLeftPaddle(this.ref.nativeElement);
      return;
    }
    this.collision.registerRightPaddle(this.ref.nativeElement);
  }

  private centerPaddle(): void {
    this.centerVertically();
    this.centerHorizontally();
  }

  private centerVertically(): void {
    this.y = this.sizes.groundHeight / 2 - this.sizes.paddleHeight / 2;
  }

  private centerHorizontally(): void {
    if (this.halfField === HalfField.Left) {
      this.x = this.sizes.pixelsFromEdges;
      return;
    }
    this.x =
      this.sizes.groundWidth -
      this.sizes.paddleWidth -
      this.sizes.pixelsFromEdges;
  }

  private onStatusChanged(): void {
    this.subSink.sink = this.controls.statusChanged$
      .pipe(filter((status: GameStatus) => status === GameStatus.Stopped))
      .subscribe((_: GameStatus) => this.centerPaddle());
  }

  protected canMove(positionY: number): boolean {
    const bottomPosition: number = positionY + this.sizes.paddleHeight;
    return positionY >= 0 && bottomPosition <= this.sizes.groundHeight;
  }
}
