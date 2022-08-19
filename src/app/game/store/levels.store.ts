import { Inaccuracy } from '../enums';
import { LevelSettings } from '../models';
import { FAST_BALL, NORMAL_BALL, SLOW_BALL } from './balls.store';

export const EASY_LEVEL: LevelSettings = {
  name: 'Easy',
  ball: SLOW_BALL,
  computerInaccuracy: Inaccuracy.High,
};

export const NORMAL_LEVEL: LevelSettings = {
  name: 'Normal',
  ball: NORMAL_BALL,
  computerInaccuracy: Inaccuracy.Medium,
};

export const HARD_LEVEL: LevelSettings = {
  name: 'Hard',
  ball: FAST_BALL,
  computerInaccuracy: Inaccuracy.Low,
};
