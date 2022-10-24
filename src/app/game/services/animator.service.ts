import { Injectable } from '@angular/core';
import { Theme } from 'src/app/shared/enums';
import { ThemeManagerService } from 'src/app/shared/services';
import { Animator } from '../interfaces';
import { NeonAnimatorService } from './neon-animations.service';
import { RetroAnimatorService } from './retro-animations.service';

@Injectable({
  providedIn: 'root',
})
export class AnimatorService implements Animator {
  constructor(
    private themeManager: ThemeManagerService,
    private retro: RetroAnimatorService,
    private neon: NeonAnimatorService
  ) {}

  private get themeAnimator(): Animator {
    if (this.themeManager.theme === Theme.Retro) return this.retro;
    return this.neon;
  }

  setPaddleHeight(paddle: HTMLElement, height: number): void {
    this.themeAnimator.setPaddleHeight(paddle, height);
  }

  turnUpShield(shield: HTMLElement): void {
    this.themeAnimator.turnUpShield(shield);
  }

  turnDownShield(shield: HTMLElement): void {
    this.themeAnimator.turnDownShield(shield);
  }

  writeGoal(): void {
    this.themeAnimator.writeGoal();
  }
}
