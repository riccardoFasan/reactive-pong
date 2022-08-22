import { Ball } from '../models';

export const SLOW_BALL: Ball = {
  name: 'Slow',
  baseSpeed: 3.5,
  acceleration: 0.25,
  maximumSpeed: 4,
};

export const NORMAL_BALL: Ball = {
  name: 'Normal',
  baseSpeed: 4,
  acceleration: 0.33,
  maximumSpeed: 5,
};

export const FAST_BALL: Ball = {
  name: 'Fast',
  baseSpeed: 4.5,
  acceleration: 0.66,
  maximumSpeed: 6,
};

export const CRAZY_BALL: Ball = {
  name: 'Crazy',
  baseSpeed: 4.75,
  acceleration: 0.675,
  maximumSpeed: 6.33,
};
