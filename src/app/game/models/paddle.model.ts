import { Observable } from 'rxjs';

export interface Paddle {
  x$: Observable<number>;
  y$: Observable<number>;

  readonly defaultX: number;
  readonly defaultY: number;
}
