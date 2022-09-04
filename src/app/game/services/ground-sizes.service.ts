import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class GroundSizesService {
  height: number = 0;
  width: number = 0;
  pixelsFromEdges: number = 0;

  constructor() {}

  updateSizes(): void {
    this.setGroundSizes();
    this.setEdgesDistance();
  }

  private get groundElement(): HTMLElement | null {
    return document.querySelector('.playground');
  }

  private setGroundSizes(): void {
    if (this.groundElement) {
      this.height = this.groundElement.offsetHeight;
      this.width = this.groundElement.offsetWidth;
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
}
