import { Level } from '../enums';
import { LevelSettings } from '../models';
import { FAST_BALL, NORMAL_BALL, SLOW_BALL } from './balls.store';

import {
  EASY_RESIZING,
  NORMAL_RESIZING,
  HARD_RESIZING,
} from './resising.store';

import {
  EASY_ARTIFACT,
  NORMAL_ARTIFACT,
  HARD_ARTIFACT,
} from './artifacts.store';

import {
  EASY_COMPUTER,
  HARD_COMPUTER,
  MEDIUM_COMPUTER,
} from './computer.store';

export const EASY_LEVEL: LevelSettings = {
  name: 'EASY',
  value: Level.Easy,
  ball: SLOW_BALL,
  computer: EASY_COMPUTER,
  resizingSettings: EASY_RESIZING,
  artifactsTiming: EASY_ARTIFACT,
  shieldsDuration: 25000,
};

export const NORMAL_LEVEL: LevelSettings = {
  name: 'NORMAL',
  value: Level.Normal,
  ball: NORMAL_BALL,
  computer: MEDIUM_COMPUTER,
  resizingSettings: NORMAL_RESIZING,
  artifactsTiming: NORMAL_ARTIFACT,
  shieldsDuration: 20000,
};

export const HARD_LEVEL: LevelSettings = {
  name: 'HARD',
  value: Level.Hard,
  ball: FAST_BALL,
  computer: HARD_COMPUTER,
  resizingSettings: HARD_RESIZING,
  artifactsTiming: HARD_ARTIFACT,
  shieldsDuration: 15000,
};

export const LEVELS: LevelSettings[] = [EASY_LEVEL, NORMAL_LEVEL, HARD_LEVEL];
