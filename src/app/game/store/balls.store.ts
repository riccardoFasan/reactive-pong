import { Ball } from '../models';

export const SLOW_BALL: Ball = {
  name: 'Slow',
  baseSpeed: 0.75,
  acceleration: 0.25,
  maximumSpeed: 1.33,
};

export const NORMAL_BALL: Ball = {
  name: 'Normal',
  baseSpeed: 1.125,
  acceleration: 0.33,
  maximumSpeed: 1.5,
};

export const FAST_BALL: Ball = {
  name: 'Fast',
  baseSpeed: 1.25,
  acceleration: 0.66,
  maximumSpeed: 1.75,
};
