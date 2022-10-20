import { InjectionToken } from '@angular/core';
import { Animations } from '../interfaces';

export const THEME_ANIMATIONS: InjectionToken<Animations> =
  new InjectionToken<Animations>('themeAnimations');
