export interface LocatedRect {
  left: number;
  right: number;
  top: number;
  bottom: number;
}

export function areColliding(rect1: LocatedRect, rect2: LocatedRect): boolean {
  return (
    rect1.left <= rect2.right &&
    rect1.right >= rect2.left &&
    rect1.top <= rect2.bottom &&
    rect1.bottom >= rect2.top
  );
}

export function getLocatedRect(element: HTMLElement): LocatedRect {
  const rect: DOMRect = element.getBoundingClientRect();
  return {
    left: rect.left,
    right: rect.right,
    top: rect.top,
    bottom: rect.bottom,
  };
}
