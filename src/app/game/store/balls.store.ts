import { Ball } from '../models';

export const SLOW_BALL: Ball = {
  name: 'Slow',
  baseSpeed: 4.66,
  acceleration: 0.25,
  maximumSpeed: 5.33,
};

export const NORMAL_BALL: Ball = {
  name: 'Normal',
  baseSpeed: 5.33,
  acceleration: 0.33,
  maximumSpeed: 6.65,
};

export const FAST_BALL: Ball = {
  name: 'Fast',
  baseSpeed: 6,
  acceleration: 0.66,
  maximumSpeed: 8,
};

export const CRAZY_BALL: Ball = {
  name: 'Crazy',
  baseSpeed: 6.5,
  acceleration: 0.75,
  maximumSpeed: 8.5,
};
