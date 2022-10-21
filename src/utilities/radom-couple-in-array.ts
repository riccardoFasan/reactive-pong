import { randomIntegerBetween } from './random-integer-between';

export function randomCoupleInArray(array: any[]): [any, any] {
  const maxIndex: number = array.length - 1;
  const firstRandomIndex: number = randomIntegerBetween(0, maxIndex);
  const secondRandomIndex: number =
    firstRandomIndex === maxIndex ? 0 : firstRandomIndex + 1;
  return [array[firstRandomIndex], array[secondRandomIndex]];
}
