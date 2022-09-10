import { Ball } from '../models';

export const SLOW_BALL: Ball = {
  name: 'Slow',
  baseSpeed: 3,
  acceleration: 0.15,
  maximumSpeed: 3.75,
};

export const NORMAL_BALL: Ball = {
  name: 'Normal',
  baseSpeed: 3.25,
  acceleration: 0.175,
  maximumSpeed: 4,
};

export const FAST_BALL: Ball = {
  name: 'Fast',
  baseSpeed: 3.5,
  acceleration: 0.25,
  maximumSpeed: 4.25,
};

export const CRAZY_BALL: Ball = {
  name: 'Crazy',
  baseSpeed: 4,
  acceleration: 0.275,
  maximumSpeed: 4.5,
};
