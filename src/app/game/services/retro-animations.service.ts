import { Injectable } from '@angular/core';
import { Animation, AnimationController } from '@ionic/angular';
import { HalfField } from 'src/app/shared/enums';
import { Animator } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class RetroAnimatorService implements Animator {
  constructor(private animationController: AnimationController) {}

  animateBorder(ground: HTMLElement, halfField: HalfField): void {
    const className: string = `border-fade-${
      halfField === HalfField.Left ? 'left' : 'right'
    }`;
    ground.classList.add(className);
    ground.classList.remove(className);
  }

  setPaddleHeight(paddle: HTMLElement, height: number): void {
    this.animationController
      .create()
      .addElement(paddle)
      .duration(300)
      .easing('ease')
      .to('height', `${height}px`)
      .fill('forwards')
      .play();
  }

  fadeShield(shield: HTMLElement): void {
    this.animationController
      .create()
      .addElement(shield)
      .duration(300)
      .to('background', '#fbfeff')
      .fill('none')
      .play();
  }

  turnUpShield(shield: HTMLElement): void {
    this.animationController
      .create()
      .addElement(shield)
      .duration(200)
      .easing('ease')
      .to('opacity', 0.75)
      .fill('forwards')
      .play();
  }

  turnDownShield(shield: HTMLElement): void {
    this.animationController
      .create()
      .addElement(shield)
      .duration(200)
      .easing('ease')
      .to('opacity', 0)
      .fill('forwards')
      .play();
  }

  writeGoal(): void {
    const goal: HTMLElement | null = document.querySelector('.goal');
    if (!goal) return;
    const fadeIn: Animation = this.animationController
      .create()
      .addElement(goal)
      .duration(200)
      .easing('ease-in-out')
      .to('opacity', 1)
      .to('transform', 'scale(1)')
      .fill('forwards');

    const fadeOut: Animation = this.animationController
      .create()
      .addElement(goal)
      .delay(600)
      .duration(50)
      .easing('ease-in-out')
      .to('opacity', 0)
      .to('transform', 'scale(0)')
      .fill('forwards');

    this.animationController
      .create()
      .addAnimation(fadeIn)
      .addAnimation(fadeOut)
      .play();
  }
}
