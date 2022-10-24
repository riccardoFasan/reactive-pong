import { Ball } from '../models';

export const SLOW_BALL: Ball = {
  name: 'Slow',
  baseSpeed: 3.25,
  acceleration: 0,
  maximumSpeed: 3.25,
};

export const NORMAL_BALL: Ball = {
  name: 'Normal',
  baseSpeed: 3.25,
  acceleration: 0.15,
  maximumSpeed: 3.33,
};

export const FAST_BALL: Ball = {
  name: 'Fast',
  baseSpeed: 3.33,
  acceleration: 0.25,
  maximumSpeed: 3.45,
};

export const CRAZY_BALL: Ball = {
  name: 'Crazy',
  baseSpeed: 3.75,
  acceleration: 0.275,
  maximumSpeed: 4,
};
