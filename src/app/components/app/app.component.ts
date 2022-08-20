import { AfterViewInit, Component } from '@angular/core';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements AfterViewInit {
  hasOrientationBeenAdjusted: boolean = false;

  constructor(private orientation: ScreenOrientation) {}

  async ngAfterViewInit(): Promise<void> {
    await this.adjustStyle();
    this.hasOrientationBeenAdjusted = true;
  }

  private async adjustStyle(): Promise<void> {
    try {
      // some devices like PCs have no orientation
      await this.orientation.lock(this.orientation.ORIENTATIONS.LANDSCAPE);
    } catch {}
  }
}
