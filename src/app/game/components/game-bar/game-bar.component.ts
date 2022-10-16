import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Player } from 'src/app/shared/enums';
import { PlayersService } from 'src/app/shared/services';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { GameStatus } from '../../enums';
import { Score } from '../../models';
import {
  AlertsService,
  GameControlsService,
  ScoreService,
} from '../../services';

@Component({
  selector: 'app-game-bar',
  templateUrl: './game-bar.component.html',
  styleUrls: ['./game-bar.component.scss'],
})
export class GameBarComponent implements AfterViewInit, OnDestroy {
  gameStatus$: Observable<GameStatus> = this.controls.statusChanged$;
  points$: Observable<Score> = this.score.scoreChanged$;

  private subSink: SubSink = new SubSink();

  constructor(
    private score: ScoreService,
    private controls: GameControlsService,
    private players: PlayersService,
    private router: Router,
    private alerts: AlertsService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.start();
  }

  ngOnDestroy(): void {
    this.quit();
  }

  pause(): void {
    this.controls.pause();
    this.alerts.renderAlert('Resume', [
      { text: 'Quit', role: 'destructive', handler: () => this.quit() },
      { text: 'Play again', role: 'confirm', handler: () => this.resume() },
    ]);
  }

  private start(): void {
    this.controls.start();
    this.onGameOver();
  }

  private quit(): void {
    this.stop();
    this.backToHome();
  }

  private stop(): void {
    this.controls.stop();
    this.score.resetScore();
    this.subSink.unsubscribe();
  }

  private backToHome(): void {
    this.router.navigateByUrl('/home');
  }

  private resume(): void {
    this.controls.resume();
  }

  private onGameOver(): void {
    this.subSink.sink = this.score.winnerChanged$.subscribe(
      (winner: Player) => {
        this.stop();
        const message: string =
          winner === this.players.user ? 'Victory' : 'Game over';
        this.alerts.renderAlert(message, [
          {
            text: 'Quit',
            role: 'destructive',
            handler: () => this.backToHome(),
          },
          { text: 'Play again', role: 'confirm', handler: () => this.start() },
        ]);
      }
    );
  }
}
