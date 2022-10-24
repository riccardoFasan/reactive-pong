import { ElementRef, Injectable } from '@angular/core';
import { HalfField } from 'src/app/shared/enums';
import { getLocatedRect, LocatedRect } from 'src/utilities';
import { Artifact } from '../models';

@Injectable({
  providedIn: 'root',
})
export class ElementsService {
  activators: { artifact: Artifact; ref: ElementRef }[] = [];
  leftPaddle!: HTMLElement;
  rightPaddle!: HTMLElement;
  ground!: HTMLElement;
  leftShield: HTMLElement | undefined;
  rightShield: HTMLElement | undefined;

  readonly edgesDistance: number = 6.5 * 16;

  get groundHeight(): number {
    if (!this.ground) return 0;
    return this.ground.offsetHeight;
  }

  get groundWidth(): number {
    if (!this.ground) return 0;
    return this.ground.offsetWidth;
  }

  get leftPaddleRect(): LocatedRect {
    return getLocatedRect(this.leftPaddle);
  }

  get rightPaddleRect(): LocatedRect {
    return getLocatedRect(this.rightPaddle);
  }

  get leftShieldRect(): LocatedRect | undefined {
    if (!this.leftShield) return;
    return getLocatedRect(this.leftShield);
  }

  get rightShieldRect(): LocatedRect | undefined {
    if (!this.rightShield) return;
    return getLocatedRect(this.rightShield);
  }

  registerArtifact(artifact: Artifact, ref: ElementRef): void {
    this.activators = [...this.activators, { artifact, ref }];
  }

  unregisterArtifact(id: number): void {
    this.activators = this.activators.filter(
      (activator) => activator.artifact.id !== id
    );
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
