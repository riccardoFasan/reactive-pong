import { Component, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { GameStatus, HalfField, Player } from '../../enums';
import { Score } from '../../models';
import {
  GameControlsService,
  PlayersService,
  ScoreService,
} from '../../services';

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
