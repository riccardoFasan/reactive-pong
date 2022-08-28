import { Injectable } from '@angular/core';
import { Collision, Player } from '../enums';
import { GameControlsService } from './game-controls.service';
import { ScoreService } from './score.service';

@Injectable({
  providedIn: 'root',
})
export class GoalService {
  constructor(
    private controls: GameControlsService,
    private score: ScoreService
  ) {}

  updateScoreAndDelayGame(collision: Collision): void {
    // ! make delay just doing pause / play is tech debt. But the other ideas I found are worse
    this.controls.pause();
    const player: Player =
      collision === Collision.Player1Gate ? Player.Player2 : Player.Player1;
    this.score.addPoint(player);
    this.controls.resume();
  }
}
