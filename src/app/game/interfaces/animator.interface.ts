export interface Animator {
  setPaddleHeight(paddle: HTMLElement, height: number): void;
  turnUpShield(shield: HTMLElement): void;
  turnDownShield(shield: HTMLElement): void;
  writeGoal(): void;
}
