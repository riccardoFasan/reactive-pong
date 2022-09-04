import { Inaccuracy, Level } from '../enums';
import { LevelSettings } from '../models';
import { CRAZY_BALL, FAST_BALL, NORMAL_BALL, SLOW_BALL } from './balls.store';
import {
  EASY_RESIZING,
  NORMAL_RESIZING,
  HARD_RESIZING,
  INSANE_RESIZING,
} from './resising.store';

import {
  EASY_ARTIFACT,
  NORMAL_ARTIFACT,
  HARD_ARTIFACT,
  INSANE_ARTIFACT,
} from './artifacts.store';

export const EASY_LEVEL: LevelSettings = {
  name: 'Easy',
  value: Level.Easy,
  ball: SLOW_BALL,
  computerInaccuracy: Inaccuracy.High,
  resizingSettings: EASY_RESIZING,
  artifactsTiming: EASY_ARTIFACT,
};

export const NORMAL_LEVEL: LevelSettings = {
  name: 'Normal',
  value: Level.Normal,
  ball: NORMAL_BALL,
  computerInaccuracy: Inaccuracy.Medium,
  resizingSettings: NORMAL_RESIZING,
  artifactsTiming: NORMAL_ARTIFACT,
};

export const HARD_LEVEL: LevelSettings = {
  name: 'Hard',
  value: Level.Hard,
  ball: FAST_BALL,
  computerInaccuracy: Inaccuracy.Low,
  resizingSettings: HARD_RESIZING,
  artifactsTiming: HARD_ARTIFACT,
};

export const INSANE_LEVEL: LevelSettings = {
  name: 'Insane',
  value: Level.Insane,
  ball: CRAZY_BALL,
  computerInaccuracy: Inaccuracy.None,
  resizingSettings: INSANE_RESIZING,
  artifactsTiming: INSANE_ARTIFACT,
};

export const LEVELS: LevelSettings[] = [
  EASY_LEVEL,
  NORMAL_LEVEL,
  HARD_LEVEL,
  INSANE_LEVEL,
];
