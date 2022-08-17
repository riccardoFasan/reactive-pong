import { BehaviorSubject } from 'rxjs';

export interface PaddleController {
  x$: BehaviorSubject<number>;
  y$: BehaviorSubject<number>;
}
