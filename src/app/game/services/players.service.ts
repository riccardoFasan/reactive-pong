import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HalfField, Player } from '../enums';
import { Fields } from '../models';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  // * Player 1 is always on left and Player 2 on right

  private userStore$: BehaviorSubject<Player> = new BehaviorSubject<Player>(
    Player.Player2
  );

  fieldsChanged$: Observable<Fields> = this.userStore$.pipe(
    map((user: Player) => ({
      user: user === Player.Player1 ? HalfField.Left : HalfField.Right,
      opponent: user !== Player.Player1 ? HalfField.Left : HalfField.Right,
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
    return this.user === Player.Player1 ? Player.Player2 : Player.Player1;
  }
}
