import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HalfField, Player } from '../enums';
import { Fields } from '../../game/models';
import { PreferencesService } from './preferences.service';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private userStore$: BehaviorSubject<Player> = new BehaviorSubject<Player>(
    Player.Right
  );

  private fieldsChanged$: Observable<Fields> = this.userStore$.pipe(
    map((user: Player) => ({
      user: user === Player.Left ? HalfField.Left : HalfField.Right,
      opponent: user !== Player.Left ? HalfField.Left : HalfField.Right,
    }))
  );

  userField$: Observable<HalfField> = this.fieldsChanged$.pipe(
    map((fields: Fields) => fields.user)
  );

  opponentField$: Observable<HalfField> = this.fieldsChanged$.pipe(
    map((fields: Fields) => fields.opponent)
  );

  constructor(private preferences: PreferencesService) {
    this.loadPreference();
  }

  get user(): Player {
    return this.userStore$.getValue();
  }

  set user(player: Player) {
    this.userStore$.next(player);
    this.savePreference();
  }

  get opponent(): Player {
    return this.user === Player.Left ? Player.Right : Player.Left;
  }

  getPlayerByField(halfField: HalfField): Player {
    if (halfField === HalfField.Right) return Player.Right;
    return Player.Left;
  }

  private async loadPreference(): Promise<void> {
    const defaultPlayer: Player | null = await this.preferences.getPlayer();
    if (defaultPlayer) this.user = defaultPlayer;
  }

  private savePreference(): void {
    this.preferences.setPlayer(this.user);
  }
}
