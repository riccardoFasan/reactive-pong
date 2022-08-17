export function areColliding(
  element1: HTMLElement,
  element2: HTMLElement
): boolean {
  const rect1: DOMRect = element1.getBoundingClientRect();
  const rect2: DOMRect = element2.getBoundingClientRect();
  return (
    rect1.left <= rect2.right &&
    rect1.right >= rect2.left &&
    rect1.top <= rect2.bottom &&
    rect1.bottom >= rect2.top
  );
}
