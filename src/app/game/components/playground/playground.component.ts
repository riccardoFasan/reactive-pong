import { Component, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { EventName, GameStatus, HalfField, Player } from '../../enums';
import {
  GameControlsService,
  EventBusService,
  ScoreService,
} from '../../services';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlayGroundComponent implements OnDestroy {
  player: Player = Player.Player1;
  opponent: Player = Player.Player2;

  userPaddleHalfField: HalfField =
    this.player === Player.Player1 ? HalfField.Left : HalfField.Right;
  computerPaddleHalfField: HalfField =
    this.player !== Player.Player1 ? HalfField.Left : HalfField.Right;

  private subSink: SubSink = new SubSink();

  gameStatus$: Observable<GameStatus> = this.controls.statusChanged$;

  constructor(
    public score: ScoreService,
    private controls: GameControlsService,
    private alertController: AlertController,
    private bus: EventBusService
  ) {}

  ngOnDestroy(): void {
    this.stop();
  }

  async start(): Promise<void> {
    await isIonicReady();
    this.controls.start();
    this.onGameOver();
  }

  stop(): void {
    this.controls.stop();
    this.score.resetScore();
    this.subSink.unsubscribe();
  }

  private onGameOver(): void {
    this.subSink.sink = this.bus.on(EventName.GameOver, (winner: Player) => {
      const message: string = winner === this.player ? 'You won' : 'Game lost';
      this.presentAlert(message);
    });
  }

  private async presentAlert(message: string): Promise<void> {
    const alert: HTMLIonAlertElement = await this.alertController.create({
      header: 'Game Over',
      subHeader: message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
