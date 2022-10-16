import { Injectable } from '@angular/core';
import { AlertButton, AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  constructor(private alertController: AlertController) {}

  async renderAlert(message: string, buttons: AlertButton[]): Promise<void> {
    const alert: HTMLIonAlertElement = await this.alertController.create({
      header: message,
      buttons,
    });
    await alert.present();
  }
}
