import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { isIonicReady } from 'src/utilities';
import { SubSink } from 'subsink';
import { EventName, HalfField, Player } from '../../enums';
import { ControlsService, EventBusService, ScoreService } from '../../services';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlayGroundComponent implements AfterViewInit, OnDestroy {
  player: Player = Player.Player1;
  opponent: Player = Player.Player2;

  userPaddleHalfField: HalfField =
    this.player === Player.Player1 ? HalfField.Left : HalfField.Right;
  computerPaddleHalfField: HalfField =
    this.player !== Player.Player1 ? HalfField.Left : HalfField.Right;

  private subSink: SubSink = new SubSink();

  constructor(
    public score: ScoreService,
    private controls: ControlsService,
    private alertController: AlertController,
    private bus: EventBusService
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.controls.start();
    this.onGameOver();
  }

  ngOnDestroy(): void {
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
      header: 'Game over',
      message,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
