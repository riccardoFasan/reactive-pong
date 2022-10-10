import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HalfField, Player } from '../enums';
import { Fields } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  private userStore$: BehaviorSubject<Player> = new BehaviorSubject<Player>(
    Player.Right
  );

  fieldsChanged$: Observable<Fields> = this.userStore$.pipe(
    map((user: Player) => ({
      user: user === Player.Left ? HalfField.Left : HalfField.Right,
      opponent: user !== Player.Left ? HalfField.Left : HalfField.Right,
    }))
  );

  constructor() {}

  get user(): Player {
    return this.userStore$.getValue();
  }

  set user(player: Player) {
    this.userStore$.next(player);
  }

  get opponent(): Player {
    return this.user === Player.Left ? Player.Right : Player.Left;
  }

  getPlayerByField(halfField: HalfField): Player {
    if (halfField === HalfField.Right) return Player.Right;
    return Player.Left;
  }
}
