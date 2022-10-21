import { Injectable } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { HalfField } from 'src/app/shared/enums';
import { Animator } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class NeonAnimatorService implements Animator {
  constructor(private controller: AnimationController) {}

  animateBorder(ground: HTMLElement, halfField: HalfField): void {}

  fadePaddle(paddle: HTMLElement): void {
    console.log('neon fade');
  }

  resizePaddle(
    paddle: HTMLElement,
    delay: number,
    targetHeight: number,
    defaultHeight: number
  ): void {}

  setPaddleHeight(paddle: HTMLElement, height: number): void {}

  fadeShield(shield: HTMLElement): void {}

  turnUpShield(shield: HTMLElement): void {}

  turnDownShield(shield: HTMLElement): void {}

  writeGoal(): void {}
}
