import { Injectable } from '@angular/core';
import { AnimationController } from '@ionic/angular';
import { HalfField } from 'src/app/shared/enums';
import { Animator } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class NeonAnimatorService implements Animator {
  constructor(private controller: AnimationController) {}

  setPaddleHeight(paddle: HTMLElement, height: number): void {}

  turnUpShield(shield: HTMLElement): void {}

  turnDownShield(shield: HTMLElement): void {}

  writeGoal(): void {}
}
