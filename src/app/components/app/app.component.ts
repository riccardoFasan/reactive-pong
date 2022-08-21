import { AfterViewInit, Component } from '@angular/core';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { StatusBar } from '@capacitor/status-bar';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements AfterViewInit {
  hasStyleBeenAdjusted: boolean = false;

  constructor(private orientation: ScreenOrientation) {}

  async ngAfterViewInit(): Promise<void> {
    await this.adjustStyle();
    this.hasStyleBeenAdjusted = true;
  }

  private async adjustStyle(): Promise<void> {
    try {
      // some devices like PCs have no orientation
      await Promise.all([this.setOrientation(), this.hideStatusBar()]);
    } catch {}
  }

  private async setOrientation(): Promise<void> {
    await this.orientation.lock(this.orientation.ORIENTATIONS.LANDSCAPE);
  }

  private async hideStatusBar(): Promise<void> {
    await StatusBar.hide();
  }
}
