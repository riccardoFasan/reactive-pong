import { ComputerSpeed, Inaccuracy } from '../enums';
import { ComputerSettings } from '../models';

export const EASY_COMPUTER: ComputerSettings = {
  speed: ComputerSpeed.Slow,
  inaccuracy: Inaccuracy.High,
};

export const MEDIUM_COMPUTER: ComputerSettings = {
  speed: ComputerSpeed.Medium,
  inaccuracy: Inaccuracy.Medium,
};

export const HARD_COMPUTER: ComputerSettings = {
  speed: ComputerSpeed.Fast,
  inaccuracy: Inaccuracy.Low,
};

export const INSANE_COMPUTER: ComputerSettings = {
  speed: ComputerSpeed.Supersonic,
  inaccuracy: Inaccuracy.None,
};
