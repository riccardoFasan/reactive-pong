import { Injectable } from '@angular/core';
import { Player } from 'src/app/shared/enums';
import { Collision } from '../enums';
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
      collision === Collision.PlayerLeftGate ? Player.Right : Player.Left;
    this.score.addPoint(player);
    this.controls.resume();
  }
}
