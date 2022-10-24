import { Ball } from '../models';

export const SLOW_BALL: Ball = {
  name: 'Slow',
  baseSpeed: 3.25 * 1.25,
  acceleration: 0,
  maximumSpeed: 3.25 * 1.25,
};

export const NORMAL_BALL: Ball = {
  name: 'Normal',
  baseSpeed: 3.25 * 1.25,
  acceleration: 0.15 * 1.25,
  maximumSpeed: 3.33 * 1.25,
};

export const FAST_BALL: Ball = {
  name: 'Fast',
  baseSpeed: 3.33 * 1.25,
  acceleration: 0.25 * 1.25,
  maximumSpeed: 3.5 * 1.25,
};

export const CRAZY_BALL: Ball = {
  name: 'Crazy',
  baseSpeed: 3.75 * 1.25,
  acceleration: 0.275 * 1.25,
  maximumSpeed: 4.25 * 1.25,
};
