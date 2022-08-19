import { Ball } from '../models';

export const SLOW_BALL: Ball = {
  name: 'Slow',
  baseSpeed: 0.25,
  acceleration: 0.001,
  maximumSpeed: 0.35,
};

export const NORMAL_BALL: Ball = {
  name: 'Normal',
  baseSpeed: 0.3,
  acceleration: 0.0015,
  maximumSpeed: 0.4,
};

export const FAST_BALL: Ball = {
  name: 'Fast',
  baseSpeed: 0.35,
  acceleration: 0.002,
  maximumSpeed: 0.55,
};
