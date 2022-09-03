import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class SizesService {
  paddleHeight: number = 0;
  paddleWidth: number = 0;
  groundHeight: number = 0;
  groundWidth: number = 0;
  pixelsFromEdges: number = 0;
  ballHeight: number = 0;
  ballWidth: number = 0;

  constructor() {}

  updateSizes(): void {
    this.setPaddleSizes();
    this.setGroundSizes();
    this.setEdgesDistance();
    this.setBallSizes();
  }

  private get paddleElement(): HTMLElement | null {
    return document.querySelector('app-paddle');
  }

  private get groundElement(): HTMLElement | null {
    return document.querySelector('.playground');
  }

  private get ballElement(): HTMLElement | null {
    return document.querySelector('app-ball');
  }

  private setPaddleSizes(): void {
    if (this.paddleElement) {
      this.paddleHeight = this.paddleElement.offsetHeight;
      this.paddleWidth = this.paddleElement.offsetWidth;
    }
  }

  private setGroundSizes(): void {
    if (this.groundElement) {
      this.groundHeight = this.groundElement.offsetHeight;
      this.groundWidth = this.groundElement.offsetWidth;
    }
  }

  private setEdgesDistance(): void {
    if (this.groundElement) {
      const groundContainer: HTMLElement = this.groundElement.parentElement!;
      const style: CSSStyleDeclaration =
        window.getComputedStyle(groundContainer);
      this.pixelsFromEdges = parseInt(style.paddingLeft);
    }
  }

  private setBallSizes(): void {
    if (this.ballElement) {
      this.ballHeight = this.ballElement.offsetHeight;
      this.ballWidth = this.ballElement.offsetWidth;
    }
  }
}
