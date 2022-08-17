import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Player } from '../enums';
import { Score } from '../models/score.model';

@Injectable({
  providedIn: 'root',
})
export class ScoreService {
  private player1ScoreStore$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);
  private player2ScoreStore$: BehaviorSubject<number> =
    new BehaviorSubject<number>(0);

  points$: Observable<Score> = combineLatest([
    this.player1ScoreStore$,
    this.player2ScoreStore$,
  ]).pipe(
    map(([score1, score2]) => ({
      player1: score1,
      player2: score2,
    }))
  );

  constructor() {}

  addPoint(player: Player): void {
    if (player === Player.Player1) {
      const currentScore: number = this.player1ScoreStore$.getValue();
      this.player1ScoreStore$.next(currentScore + 1);
      return;
    }
    const currentScore: number = this.player2ScoreStore$.getValue();
    this.player2ScoreStore$.next(currentScore + 1);
  }
}
