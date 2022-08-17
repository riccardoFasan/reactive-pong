import { AfterViewInit, Component } from '@angular/core';
import { isIonicReady } from 'src/utilities';
import { HalfField } from '../../enums';
import { ControlsService } from '../../services';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
})
export class FieldComponent implements AfterViewInit {
  userPaddleHalfField: HalfField = HalfField.Left;
  computerPaddleHalfField: HalfField = HalfField.Right;

  constructor(private controls: ControlsService) {}

  async ngAfterViewInit(): Promise<void> {
    await isIonicReady();
    this.controls.start();
  }
}
