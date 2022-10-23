import { Ball } from '../models';

export const SLOW_BALL: Ball = {
  name: 'Slow',
  baseSpeed: 3.25 * 4,
  acceleration: 0,
  maximumSpeed: 3.25 * 4,
};

export const NORMAL_BALL: Ball = {
  name: 'Normal',
  baseSpeed: 3.25 * 4,
  acceleration: 0.15 * 4,
  maximumSpeed: 3.33 * 4,
};

export const FAST_BALL: Ball = {
  name: 'Fast',
  baseSpeed: 3.33 * 4,
  acceleration: 0.25 * 4,
  maximumSpeed: 3.5 * 4,
};

export const CRAZY_BALL: Ball = {
  name: 'Crazy',
  baseSpeed: 3.75 * 4,
  acceleration: 0.275 * 4,
  maximumSpeed: 4.25 * 4,
};
