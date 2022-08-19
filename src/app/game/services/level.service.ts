import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Level } from '../enums';
import { LevelSettings } from '../models';
import { EASY_LEVEL, HARD_LEVEL, NORMAL_LEVEL } from '../store';

@Injectable({
  providedIn: 'root',
})
export class LevelService {
  private levelStore$: BehaviorSubject<Level> = new BehaviorSubject<Level>(
    Level.Normal
  );

  levelChanged$: Observable<LevelSettings> = this.levelStore$
    .asObservable()
    .pipe(
      map((level: Level) => {
        if (level === Level.Easy) return EASY_LEVEL;
        if (level === Level.Hard) return HARD_LEVEL;
        return NORMAL_LEVEL;
      })
    );

  constructor() {}

  set(level: Level): void {
    this.levelStore$.next(level);
  }
}
