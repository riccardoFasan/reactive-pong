import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
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

  scoreChanged$: Observable<Score> = combineLatest([
    this.player1ScoreStore$,
    this.player2ScoreStore$,
  ]).pipe(
    map(([score1, score2]) => ({
      player1: score1,
      player2: score2,
    }))
  );

  private winnerStore$: Subject<Player> = new Subject<Player>();
  winnerChanged$: Observable<Player> = this.winnerStore$.asObservable();

  private readonly maximumScore: number = 2;

  addPoint(player: Player): void {
    if (player === Player.Player1) {
      const currentScore: number = this.player1ScoreStore$.getValue();
      this.player1ScoreStore$.next(currentScore + 1);
    } else {
      const currentScore: number = this.player2ScoreStore$.getValue();
      this.player2ScoreStore$.next(currentScore + 1);
    }
    this.searchForWinnerAndNotify();
  }

  resetScore(): void {
    this.player1ScoreStore$.next(0);
    this.player2ScoreStore$.next(0);
  }

  private searchForWinnerAndNotify(): void {
    const winner: Player | undefined = this.getWinner();
    if (winner) this.winnerStore$.next(winner);
  }

  private getWinner(): Player | undefined {
    if (this.isWinner(this.player1ScoreStore$.getValue())) {
      return Player.Player1;
    }
    if (this.isWinner(this.player2ScoreStore$.getValue())) {
      return Player.Player2;
    }
    return;
  }

  private isWinner(score: number): boolean {
    return score >= this.maximumScore;
  }
}
