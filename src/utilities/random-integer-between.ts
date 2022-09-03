import { randomFloatBetween } from './random-float-between';

export function randomIntegerBetween(min: number, max: number): number {
  return Math.round(randomFloatBetween(min, max));
}
