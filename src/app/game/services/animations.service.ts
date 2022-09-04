import { Injectable } from '@angular/core';
import { Animation, AnimationController } from '@ionic/angular';
import { HalfField } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class AnimationsService {
  constructor(private animations: AnimationController) {}

  animateBorder(ground: HTMLElement, halfField: HalfField): void {
    const property: string =
      halfField === HalfField.Left ? 'borderLeft' : 'borderRight';
    this.animations
      .create()
      .addElement(ground)
      .easing('ease')
      .duration(300)
      .iterations(3)
      .keyframes([
        {
          offset: 0,
          [property]:
            'calc(var(--playground-border-width) * 3) dashed rgba(var(--ion-color-dark-rgb), 0.15)',
        },
        {
          offset: 1,
          [property]:
            'calc(var(--playground-border-width) * 3) dashed rgba(var(--ion-color-danger-rgb), 0.66)',
        },
      ])
      .fill('none')
      .play();
  }

  fadePaddle(paddle: HTMLElement): void {
    this.animations
      .create()
      .addElement(paddle)
      .duration(200)
      .easing('ease')
      .keyframes([
        {
          offset: 0,
          backgroundColor: 'var(--ion-color-dark)',
        },
        {
          offset: 1,
          backgroundColor: 'var(--ion-color-primary)',
        },
      ])
      .fill('none')
      .play();
  }

  resizePaddle(
    paddle: HTMLElement,
    delay: number,
    targetHeight: number,
    defaultHeight: number
  ): void {
    const resize: Animation = this.animations
      .create()
      .addElement(paddle)
      .duration(200)
      .easing('ease')
      .to('height', `${targetHeight}px`)
      .fill('forwards');

    const reset: Animation = this.animations
      .create()
      .addElement(paddle)
      .duration(200)
      .easing('ease')
      .delay(delay)
      .to('height', `${defaultHeight}px`)
      .fill('forwards');

    this.animations.create().addAnimation(resize).addAnimation(reset).play();
  }

  setPaddleHeight(paddle: HTMLElement, height: number): void {
    this.animations
      .create()
      .addElement(paddle)
      .duration(200)
      .easing('ease')
      .to('height', `${height}px`)
      .fill('forwards')
      .play();
  }
}
