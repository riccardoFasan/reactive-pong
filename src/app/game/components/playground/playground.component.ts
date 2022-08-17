import { AfterViewInit, Component } from '@angular/core';
import { isIonicReady } from 'src/utilities';
import { HalfField } from '../../enums';
import { ControlsService, ScoreService } from '../../services';

@Component({
  selector: 'app-playground',
  templateUrl: './playground.component.html',
  styleUrls: ['./playground.component.scss'],
})
export class PlayGroundComponent implements AfterViewInit {
  userPaddleHalfField: HalfField = HalfField.Right;
  computerPaddleHalfField: HalfField = HalfField.Left;

  constructor(public score: ScoreService, private controls: ControlsService) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.controls.start();
  }
}
