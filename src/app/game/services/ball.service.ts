import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class BallService {
  speed: number = 1;

  constructor() {}
}
