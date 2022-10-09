import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnChanges,
  OnDestroy,
} from '@angular/core';
import { map } from 'rxjs/operators';
import { ComputerSpeed, Inaccuracy } from '../enums';
import { PaddleController } from '../interfaces';
import { ComputerSettings, LevelSettings } from '../models';
import {
  GameControlsService,
  LevelService,
  BallDirectionService,
  ElementsService,
} from '../services';
import { BaseControllerDirective } from './base-controller.directive';

@Directive({
  selector: '[appComputerController]',
})
export class ComputerControllerDirective
  extends BaseControllerDirective
  implements AfterViewInit, OnChanges, OnDestroy, PaddleController
{
  private speed: number = ComputerSpeed.Medium;
  private inaccuracy: Inaccuracy = Inaccuracy.Medium;

  constructor(
    elements: ElementsService,
    ref: ElementRef,
    controls: GameControlsService,
    private level: LevelService,
    private direction: BallDirectionService
  ) {
    super(elements, ref, controls);
  }

  override async ngAfterViewInit(): Promise<void> {
    super.ngAfterViewInit();
    this.onLevelChanged();
    this.movePaddle();
  }

  private onLevelChanged(): void {
    this.subSink.sink = this.level.levelChanged$
      .pipe(map((level: LevelSettings) => level.computer))
      .subscribe((settings: ComputerSettings) => {
        this.inaccuracy = settings.inaccuracy;
        this.speed = settings.speed;
      });
  }

  private movePaddle(): void {
    this.subSink.sink = this.controls.timer$.subscribe(() => {
      const correctionFactor: number = this.height * this.inaccuracy;
      const correctedPaddleHeight: number = this.direction.isBallGoingDown
        ? correctionFactor
        : this.height - correctionFactor;
      const movement: number =
        this.direction.position.y - this.y - correctedPaddleHeight;
      const positionY: number = this.y + this.speed * movement;
      if (this.canMove(positionY)) {
        this.y = positionY;
      }
    });
  }
}
