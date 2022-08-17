import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { EventName, Player } from '../enums';
import { Score } from '../models/score.model';
import { EventBusService } from './event-bus.service';

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

  private readonly maximumScore: number = 2;

  constructor(private bus: EventBusService) {}

  addPoint(player: Player): void {
    if (player === Player.Player1) {
      const currentScore: number = this.player1ScoreStore$.getValue();
      this.player1ScoreStore$.next(currentScore + 1);
      return;
    }
    const currentScore: number = this.player2ScoreStore$.getValue();
    this.player2ScoreStore$.next(currentScore + 1);
    this.notifyIfThereIsAWinner();
  }

  private notifyIfThereIsAWinner(): void {
    let winner: Player | undefined = this.getWinner();
    if (winner) {
      this.bus.emit({
        name: EventName.GameOver,
        value: winner,
      });
      this.resetScore();
    }
  }

  private getWinner(): Player | undefined {
    if (this.player1ScoreStore$.getValue() === this.maximumScore) {
      return Player.Player1;
    }
    if (this.player2ScoreStore$.getValue() === this.maximumScore) {
      return Player.Player2;
    }
    return;
  }

  private resetScore(): void {
    this.player1ScoreStore$.next(0);
    this.player2ScoreStore$.next(0);
  }
}
