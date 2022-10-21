import { HalfField } from 'src/app/shared/enums';

export interface Animator {
  animateBorder(ground: HTMLElement, halfField: HalfField): void;
  fadePaddle(paddle: HTMLElement): void;
  resizePaddle(
    paddle: HTMLElement,
    delay: number,
    targetHeight: number,
    defaultHeight: number
  ): void;
  setPaddleHeight(paddle: HTMLElement, height: number): void;
  fadeShield(shield: HTMLElement): void;
  turnUpShield(shield: HTMLElement): void;
  turnDownShield(shield: HTMLElement): void;
  writeGoal(): void;
}
