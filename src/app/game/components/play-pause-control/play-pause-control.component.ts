import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnDestroy,
} from '@angular/core';
import { Router } from '@angular/router';
import { App } from '@capacitor/app';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { HalfField, Player } from 'src/app/shared/enums';
import { PlayersService } from 'src/app/shared/services';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { GameStatus } from '../../enums';
import {
  AlertsService,
  GameControlsService,
  ScoreService,
  SoundsService,
} from '../../services';

@Component({
  selector: 'app-play-pause-control',
  templateUrl: './play-pause-control.component.html',
  styleUrls: ['./play-pause-control.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlayPauseControlComponent implements AfterViewInit, OnDestroy {
  @Input() halfField!: HalfField;

  gameStatus$: Observable<GameStatus> = this.controls.statusChanged$;

  private onGameOver$: Observable<Player> = this.score.winnerChanged$.pipe(
    tap((winner: Player) => {
      this.stop();
      const message: string =
        winner === this.players.user ? 'VICTORY' : 'GAME_OVER';
      this.alerts.renderAlert(this.translate.instant(message), [
        {
          text: this.translate.instant('QUIT'),
          role: 'destructive',
          handler: () => this.backToHome(),
        },
        {
          text: this.translate.instant('PLAY_AGAIN'),
          role: 'confirm',
          handler: () => this.start(),
        },
      ]);
    })
  );

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

  ngAfterViewInit(): void {
    App.addListener('appStateChange', ({ isActive }) => {
      if (!isActive && this.controls.currentStatus === 'RUNNING') {
        this.pause();
      }
    });
  }

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
        text: this.translate.instant('RESTART'),
        role: 'destructive',
        handler: () => this.restart(),
      },
      {
        text: this.translate.instant('RESUME'),
        role: 'confirm',
        handler: () => this.resume(),
      },
      {
        text: this.translate.instant('QUIT'),
        role: 'destructive',
        handler: () => this.quit(),
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

  private restart(): void {
    this.stop();
    this.start();
  }

  private onGameOver(): void {
    this.subSink.sink = this.onGameOver$.subscribe();
  }

  private onSoundsSwitched(): void {
    this.subSink.sink = this.sounds.onSoundPlayed$.subscribe();
  }
}
