import { AfterViewInit, Component } from '@angular/core';
import { isIonicReady } from 'src/utilities';
import { HalfField } from '../../enums';
import { ControlsService, ScoreService } from '../../services';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
})
export class FieldComponent implements AfterViewInit {
  userPaddleHalfField: HalfField = HalfField.Right;
  computerPaddleHalfField: HalfField = HalfField.Left;

  constructor(public score: ScoreService, private controls: ControlsService) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.controls.start();
  }
}
