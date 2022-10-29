import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Score } from '../../models';
import { ScoreService } from '../../services';

@Component({
  selector: 'app-score',
  templateUrl: './score.component.html',
  styleUrls: ['./score.component.scss'],
})
export class ScoreComponent {
  points$: Observable<Score> = this.score.scoreChanged$;

  constructor(private score: ScoreService) {}
}
