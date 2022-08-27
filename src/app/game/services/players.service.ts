import { Injectable } from '@angular/core';
import { HalfField, Player } from '../enums';

@Injectable({
  providedIn: 'root',
})
export class PlayersService {
  // * Player 1 is always on left and Player 2 on right

  user: Player = Player.Player2;

  constructor() {}

  get opponent(): Player {
    return this.user === Player.Player1 ? Player.Player2 : Player.Player1;
  }

  get playerHalfField(): HalfField {
    return this.user === Player.Player1 ? HalfField.Left : HalfField.Right;
  }

  get opponentHalfField(): HalfField {
    return this.user !== Player.Player1 ? HalfField.Left : HalfField.Right;
  }
}
