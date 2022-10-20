import { Injectable } from '@angular/core';
import { HalfField, Theme } from 'src/app/shared/enums';
import { ThemeManagerService } from 'src/app/shared/services';
import { Animator } from '../interfaces';
import { NeonAnimationsService } from './neon-animations.service';
import { RetroAnimationsService } from './retro-animations.service';

@Injectable({
  providedIn: 'root',
})
export class AnimationsService {
  constructor(
    private themeManager: ThemeManagerService,
    private retro: RetroAnimationsService,
    private neon: NeonAnimationsService
  ) {}

  private get themeAnimator(): Animator {
    if (this.themeManager.theme === Theme.Retro) return this.retro;
    return this.neon;
  }

  animateBorder(ground: HTMLElement, halfField: HalfField): void {
    this.themeAnimator.animateBorder(ground, halfField);
  }

  fadePaddle(paddle: HTMLElement): void {
    this.themeAnimator.fadePaddle(paddle);
  }

  resizePaddle(
    paddle: HTMLElement,
    delay: number,
    targetHeight: number,
    defaultHeight: number
  ): void {
    this.themeAnimator.resizePaddle(paddle, delay, targetHeight, defaultHeight);
  }

  setPaddleHeight(paddle: HTMLElement, height: number): void {
    this.themeAnimator.setPaddleHeight(paddle, height);
  }

  fadeShield(shield: HTMLElement): void {
    this.themeAnimator.fadeShield(shield);
  }

  turnUpShield(shield: HTMLElement): void {
    this.themeAnimator.turnUpShield(shield);
  }

  turnDownShield(shield: HTMLElement): void {
    this.themeAnimator.turnDownShield(shield);
  }
}
