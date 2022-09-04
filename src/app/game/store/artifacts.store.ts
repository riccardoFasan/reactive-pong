import { ArtifactsTiming } from '../models';

export const EASY_ARTIFACT: ArtifactsTiming = {
  timer: {
    min: 7000,
    max: 9000,
  },
  profitTime: 12000,
};

export const NORMAL_ARTIFACT: ArtifactsTiming = {
  timer: {
    min: 6000,
    max: 11000,
  },
  profitTime: 10000,
};

export const HARD_ARTIFACT: ArtifactsTiming = {
  timer: {
    min: 5000,
    max: 12000,
  },
  profitTime: 9000,
};

export const INSANE_ARTIFACT: ArtifactsTiming = {
  timer: {
    min: 4000,
    max: 14000,
  },
  profitTime: 8000,
};
