import { Component } from '@angular/core';
import { HalfField } from '../../enums';

@Component({
  selector: 'app-field',
  templateUrl: './field.component.html',
  styleUrls: ['./field.component.scss'],
})
export class FieldComponent {
  userPaddleHalfField: HalfField = HalfField.Left;
  computerPaddleHalfField: HalfField = HalfField.Right;
}
