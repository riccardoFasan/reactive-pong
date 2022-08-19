import { Ball } from '../models';

export const SLOW_BALL: Ball = {
  name: 'Slow',
  baseSpeed: 0.05,
  acceleration: 0.0005,
  maximumSpeed: 0.25,
};

export const NORMAL_BALL: Ball = {
  name: 'Normal',
  baseSpeed: 0.075,
  acceleration: 0.00075,
  maximumSpeed: 0.33,
};

export const FAST_BALL: Ball = {
  name: 'Fast',
  baseSpeed: 0.1,
  acceleration: 0.001,
  maximumSpeed: 0.43,
};
