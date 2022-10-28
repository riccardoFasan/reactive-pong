import { ChangeDetectionStrategy, Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
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
  SoundsService,
} from '../../services';

@Component({
  selector: 'app-game-bar',
  templateUrl: './game-bar.component.html',
  styleUrls: ['./game-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameBarComponent implements OnDestroy {
  gameStatus$: Observable<GameStatus> = this.controls.statusChanged$;
  points$: Observable<Score> = this.score.scoreChanged$;

  private subSink: SubSink = new SubSink();

  constructor(
    private score: ScoreService,
    private controls: GameControlsService,
    private players: PlayersService,
    private router: Router,
    private alerts: AlertsService,
    private translate: TranslateService,
    private sounds: SoundsService
  ) {}

  ngOnDestroy(): void {
    this.quit();
  }

  async start(): Promise<void> {
    await isIonicReady();
    this.sounds.init();
    this.controls.start();
    this.onSoundsSwitched();
    this.onGameOver();
  }

  pause(): void {
    this.controls.pause();
    this.alerts.renderAlert(this.translate.instant('GAME_PAUSED'), [
      {
        text: this.translate.instant('QUIT'),
        role: 'destructive',
        handler: () => this.quit(),
      },
      {
        text: this.translate.instant('RESUME'),
        role: 'confirm',
        handler: () => this.resume(),
      },
    ]);
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
          winner === this.players.user ? 'VICTORY' : 'GAME_OVER';
        this.alerts.renderAlert(this.translate.instant(message), [
          {
            text: this.translate.instant('QUIT'),
            role: 'destructive',
            handler: () => this.backToHome(),
          },
          { text: 'Play again', role: 'confirm', handler: () => this.start() },
        ]);
      }
    );
  }

  private onSoundsSwitched(): void {
    this.subSink.sink = this.sounds.onSoundPlayed$.subscribe();
  }
}
