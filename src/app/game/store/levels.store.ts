import { Inaccuracy, Level } from '../enums';
import { LevelSettings } from '../models';
import { CRAZY_BALL, FAST_BALL, NORMAL_BALL, SLOW_BALL } from './balls.store';

export const EASY_LEVEL: LevelSettings = {
  name: 'Easy',
  value: Level.Easy,
  ball: SLOW_BALL,
  computerInaccuracy: Inaccuracy.High,
};

export const NORMAL_LEVEL: LevelSettings = {
  name: 'Normal',
  value: Level.Normal,
  ball: NORMAL_BALL,
  computerInaccuracy: Inaccuracy.Medium,
};

export const HARD_LEVEL: LevelSettings = {
  name: 'Hard',
  value: Level.Hard,
  ball: FAST_BALL,
  computerInaccuracy: Inaccuracy.Low,
};

export const INSANE_LEVEL: LevelSettings = {
  name: 'Insane',
  value: Level.Insane,
  ball: CRAZY_BALL,
  computerInaccuracy: Inaccuracy.None,
};

export const LEVELS: LevelSettings[] = [
  EASY_LEVEL,
  NORMAL_LEVEL,
  HARD_LEVEL,
  INSANE_LEVEL,
];
