import { Component } from '@angular/core';
import { HalfField, Player } from '../../enums';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlayGroundComponent {
  player: Player = Player.Player1;
  opponent: Player = Player.Player2;

  userPaddleHalfField: HalfField =
    this.player === Player.Player1 ? HalfField.Left : HalfField.Right;
  computerPaddleHalfField: HalfField =
    this.player !== Player.Player1 ? HalfField.Left : HalfField.Right;
}
