import { Location } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-back',
  templateUrl: './back.component.html',
  styleUrls: ['./back.component.scss'],
})
export class BackComponent {
  constructor(private location: Location) {}

  back(): void {
    this.location.historyGo(-1);
  }
}
