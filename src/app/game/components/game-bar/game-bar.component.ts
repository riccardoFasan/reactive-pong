import { Component, Input, OnDestroy } from '@angular/core';
import { AlertController, AlertInput } from '@ionic/angular';
import { Observable } from 'rxjs';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { GameStatus, HalfField, Level, Player } from '../../enums';
import { LevelSettings, Score } from '../../models';
import {
  GameControlsService,
  LevelService,
  PlayersService,
  ScoreService,
} from '../../services';
import { LEVELS } from '../../store';

@Component({
  selector: 'app-game-bar',
  templateUrl: './game-bar.component.html',
  styleUrls: ['./game-bar.component.scss'],
})
export class GameBarComponent implements OnDestroy {
  gameStatus$: Observable<GameStatus> = this.controls.statusChanged$;
  points$: Observable<Score> = this.score.scoreChanged$;

  private subSink: SubSink = new SubSink();

  constructor(
    private score: ScoreService,
    private controls: GameControlsService,
    private alertController: AlertController,
    private level: LevelService,
    private players: PlayersService
  ) {}

  ngOnDestroy(): void {
    this.stop();
  }

  async start(): Promise<void> {
    await isIonicReady();
    await this.askWhatPaddleToUse();
  }

  pause(): void {
    this.controls.pause();
    this.openPauseAlert();
  }

  private stop(): void {
    this.controls.stop();
    this.score.resetScore();
    this.subSink.unsubscribe();
  }

  private resume(): void {
    this.controls.resume();
  }

  private async askWhatPaddleToUse(): Promise<void> {
    const alert: HTMLIonAlertElement = await this.alertController.create({
      header: 'Half field',
      inputs: [
        {
          label: 'Right',
          type: 'radio',
          value: this.players.getPlayerByField(HalfField.Right),
          checked: true,
        },
        {
          label: 'Left',
          type: 'radio',
          value: this.players.getPlayerByField(HalfField.Left),
          checked: false,
        },
      ],
      buttons: [
        {
          text: 'Next',
          handler: (player: Player) => {
            this.players.user = player;
            this.askLevelAndPlay();
          },
        },
      ],
    });
    await alert.present();
  }

  private async askLevelAndPlay(): Promise<void> {
    const inputs: AlertInput[] = LEVELS.map(
      (level: LevelSettings, i: number) => ({
        label: level.name,
        type: 'radio',
        value: level.value,
        checked: i === 0,
      })
    );
    const alert: HTMLIonAlertElement = await this.alertController.create({
      header: 'Difficulty level',
      inputs: inputs,
      buttons: [
        {
          text: 'Start game',
          handler: (level: Level) => {
            this.level.set(level);
            this.controls.start();
            this.onGameOver();
          },
        },
      ],
    });
    await alert.present();
  }

  private onGameOver(): void {
    this.subSink.sink = this.score.winnerChanged$.subscribe(
      (winner: Player) => {
        this.stop();
        const message: string =
          winner === this.players.user ? 'You won' : 'Game lost';
        this.openGameOverAlert(message);
      }
    );
  }

  private async openGameOverAlert(message: string): Promise<void> {
    const alert: HTMLIonAlertElement = await this.alertController.create({
      header: 'Game Over',
      subHeader: message,
      buttons: ['OK'],
    });
    await alert.present();
  }

  private async openPauseAlert(): Promise<void> {
    const alert: HTMLIonAlertElement = await this.alertController.create({
      header: 'Pause',
      message:
        'The game is paused. Choose whether to resume the game from where it left off or close the game.',
      buttons: [
        {
          text: 'Stop',
          role: 'destructive',
          handler: () => {
            this.stop();
          },
        },
        {
          text: 'Resume',
          role: 'confirm',
          handler: () => {
            this.resume();
          },
        },
      ],
    });
    await alert.present();
  }
}
