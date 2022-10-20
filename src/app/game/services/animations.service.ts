import { Injectable } from '@angular/core';
import { HalfField, Theme } from 'src/app/shared/enums';
import { ThemeManagerService } from 'src/app/shared/services';
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

  animateBorder(ground: HTMLElement, halfField: HalfField): void {
    if (this.themeManager.theme === Theme.Retro) {
      this.retro.animateBorder(ground, halfField);
      return;
    }
    this.neon.animateBorder(ground, halfField);
  }

  fadePaddle(paddle: HTMLElement): void {
    if (this.themeManager.theme === Theme.Retro) {
      this.retro.fadePaddle(paddle);
      return;
    }
    this.neon.fadePaddle(paddle);
  }

  resizePaddle(
    paddle: HTMLElement,
    delay: number,
    targetHeight: number,
    defaultHeight: number
  ): void {
    if (this.themeManager.theme === Theme.Retro) {
      this.retro.resizePaddle(paddle, delay, targetHeight, defaultHeight);
      return;
    }
    this.neon.resizePaddle(paddle, delay, targetHeight, defaultHeight);
  }

  setPaddleHeight(paddle: HTMLElement, height: number): void {
    if (this.themeManager.theme === Theme.Retro) {
      this.retro.setPaddleHeight(paddle, height);
      return;
    }
    this.neon.setPaddleHeight(paddle, height);
  }

  fadeShield(shield: HTMLElement): void {
    if (this.themeManager.theme === Theme.Retro) {
      this.retro.fadeShield(shield);
      return;
    }
    this.neon.fadeShield(shield);
  }

  turnUpShield(shield: HTMLElement): void {
    if (this.themeManager.theme === Theme.Retro) {
      this.retro.turnUpShield(shield);
      return;
    }
    this.neon.turnUpShield(shield);
  }

  turnDownShield(shield: HTMLElement): void {
    if (this.themeManager.theme === Theme.Retro) {
      this.retro.turnDownShield(shield);
      return;
    }
    this.neon.turnDownShield(shield);
  }
}
