import { Component, Input, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { EventName, GameStatus, Player } from '../../enums';
import { Score } from '../../models';
import {
  EventBusService,
  GameControlsService,
  ScoreService,
} from '../../services';

@Component({
  selector: 'app-game-bar',
  templateUrl: './game-bar.component.html',
  styleUrls: ['./game-bar.component.scss'],
})
export class GameBarComponent implements OnDestroy {
  @Input() player!: Player;
  @Input() opponent!: Player;

  gameStatus$: Observable<GameStatus> = this.controls.statusChanged$;
  points$: Observable<Score> = this.score.points$;

  private subSink: SubSink = new SubSink();

  constructor(
    private score: ScoreService,
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
