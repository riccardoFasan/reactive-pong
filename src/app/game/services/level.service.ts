import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Level } from '../enums';
import { LevelSettings } from '../models';
import { NORMAL_LEVEL, LEVELS } from '../store';

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
        const settings: LevelSettings | undefined = LEVELS.find(
          (settings: LevelSettings) => level === settings.value
        );
        if (settings) return settings;
        return NORMAL_LEVEL;
      })
    );

  constructor() {}

  set(level: Level): void {
    this.levelStore$.next(level);
  }
}
