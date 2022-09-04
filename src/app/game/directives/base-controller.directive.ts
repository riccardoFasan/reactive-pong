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
  GroundSizesService,
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
    protected ground: GroundSizesService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.ground.updateSizes();
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

  protected get height(): number {
    if (!this.ref.nativeElement) return 0;
    return this.ref.nativeElement.offsetHeight;
  }

  protected get width(): number {
    if (!this.ref.nativeElement) return 0;
    return this.ref.nativeElement.offsetWidth;
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
    this.y = this.ground.height / 2 - this.height / 2;
  }

  private centerHorizontally(): void {
    if (this.halfField === HalfField.Left) {
      this.x = this.ground.pixelsFromEdges;
      return;
    }
    this.x = this.ground.width - this.width - this.ground.pixelsFromEdges;
  }

  private onStatusChanged(): void {
    this.subSink.sink = this.controls.statusChanged$
      .pipe(filter((status: GameStatus) => status === GameStatus.Stopped))
      .subscribe((_: GameStatus) => this.centerPaddle());
  }

  protected canMove(positionY: number): boolean {
    const bottomPosition: number = positionY + this.height;
    return positionY >= 0 && bottomPosition <= this.ground.height;
  }
}
