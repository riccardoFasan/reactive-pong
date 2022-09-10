import { ElementRef, Injectable } from '@angular/core';
import { HalfField } from '../enums';
import { Artifact } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ElementsService {
  ball!: HTMLElement;
  activators: { artifact: Artifact; ref: ElementRef }[] = [];
  leftPaddle!: HTMLElement;
  rightPaddle!: HTMLElement;
  ground!: HTMLElement;
  leftShield: HTMLElement | undefined;
  rightShield: HTMLElement | undefined;

  constructor() {}

  get ballHeight(): number {
    if (!this.ball) return 0;
    return this.ball.offsetHeight;
  }

  get ballWidth(): number {
    if (!this.ball) return 0;
    return this.ball.offsetWidth;
  }

  get ballY(): number {
    if (!this.ball) return 0;
    return parseInt(this.ball.style.top);
  }

  get ballX(): number {
    if (!this.ball) return 0;
    return parseInt(this.ball.style.left);
  }

  get groundHeight(): number {
    if (!this.ground) return 0;
    return this.ground.offsetHeight;
  }

  get groundWidth(): number {
    if (!this.ground) return 0;
    return this.ground.offsetWidth;
  }

  get edgesDistance(): number {
    if (!this.ground) return 0;
    const groundContainer: HTMLElement = this.ground.parentElement!;
    const style: CSSStyleDeclaration = window.getComputedStyle(groundContainer);
    return parseInt(style.paddingLeft);
  }

  registerArtifact(artifact: Artifact, ref: ElementRef): void {
    this.activators = [...this.activators, { artifact, ref }];
  }

  unregisterArtifact(id: number): void {
    this.activators = this.activators.filter(
      (activator) => activator.artifact.id !== id
    );
  }

  registerBall(ball: HTMLElement): void {
    this.ball = ball;
  }

  registerGround(ground: HTMLElement): void {
    this.ground = ground;
  }

  registerPaddle(paddle: HTMLElement, halfField: HalfField): void {
    if (halfField === HalfField.Right) {
      this.rightPaddle = paddle;
      return;
    }
    this.leftPaddle = paddle;
  }

  registerShield(shield: HTMLElement, halfField: HalfField): void {
    if (halfField === HalfField.Right) {
      this.rightShield = shield;
      return;
    }
    this.leftShield = shield;
  }

  unRegisterShield(halfField: HalfField): void {
    if (halfField === HalfField.Right) {
      this.rightShield = undefined;
      return;
    }
    this.leftShield = undefined;
  }
}
