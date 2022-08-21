import { Injectable } from '@angular/core';
import { AnimationController } from '@ionic/angular';
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
      .duration(250)
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
}
