import { ArtifactsTiming } from '../models';

export const EASY_ARTIFACT: ArtifactsTiming = {
  timer: {
    min: 10000,
    max: 15000,
  },
  profitTime: 15000,
};

export const NORMAL_ARTIFACT: ArtifactsTiming = {
  timer: {
    min: 10000,
    max: 14000,
  },
  profitTime: 12000,
};

export const HARD_ARTIFACT: ArtifactsTiming = {
  timer: {
    min: 9000,
    max: 13000,
  },
  profitTime: 11000,
};

export const INSANE_ARTIFACT: ArtifactsTiming = {
  timer: {
    min: 8000,
    max: 12000,
  },
  profitTime: 10000,
};
