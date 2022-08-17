import { InjectionToken } from '@angular/core';
import { PaddleController } from '../interfaces';

export const PADDLE_CONTROLLER: InjectionToken<PaddleController> =
  new InjectionToken<PaddleController>('PaddleController');
