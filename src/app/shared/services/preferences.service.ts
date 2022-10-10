import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';
import { Player } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class PreferencesService {
  constructor() {}

  setPlayer(player: Player): void {
    this.setPreference('player', player);
  }

  getPlayer(): Promise<Player | null> {
    return this.getPreference('player');
  }

  private async setPreference(key: string, value: any): Promise<void> {
    await Preferences.set({
      key,
      value,
    });
  }

  private async getPreference(key: string): Promise<any> {
    const { value } = await Preferences.get({
      key,
    });
    return value;
  }
}
