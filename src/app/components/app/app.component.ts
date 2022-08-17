import { Component, OnInit } from '@angular/core';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit {
  constructor(private orientation: ScreenOrientation) {}

  ngOnInit(): void {
    this.setOrientationLandscape();
  }

  private setOrientationLandscape(): void {
    this.orientation.lock(this.orientation.ORIENTATIONS.LANDSCAPE);
  }
}
