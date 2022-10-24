import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Router } from '@angular/router';
import { Level } from '../../enums';
import { LevelSettings } from '../../models';
import { LevelService } from '../../services';
import { LEVELS } from '../../store';

@Component({
  selector: 'app-level',
  templateUrl: './level.component.html',
  styleUrls: ['./level.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LevelComponent {
  readonly levels: LevelSettings[] = LEVELS;

  constructor(private level: LevelService, private router: Router) {}

  setLevel(level: Level): void {
    this.level.set(level);
    this.router.navigateByUrl('/game/pong');
  }
}
