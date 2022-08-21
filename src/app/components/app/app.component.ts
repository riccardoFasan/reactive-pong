import { AfterViewInit, Component, OnDestroy } from '@angular/core';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { StatusBar, StatusBarInfo } from '@capacitor/status-bar';
import { interval } from 'rxjs';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements AfterViewInit, OnDestroy {
  hasStyleBeenAdjusted: boolean = false;

  private subSink: SubSink = new SubSink();

  constructor(private orientation: ScreenOrientation) {}

  async ngAfterViewInit(): Promise<void> {
    await this.adjustStyle();
    this.hasStyleBeenAdjusted = true;
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private async adjustStyle(): Promise<void> {
    this.autoHideStatusBar();
    await this.setOrientation();
  }

  private async setOrientation(): Promise<void> {
    try {
      // some devices like PCs have no orientation
      await this.orientation.lock(this.orientation.ORIENTATIONS.LANDSCAPE);
    } catch {}
  }

  private autoHideStatusBar(): void {
    this.subSink.sink = interval(1000).subscribe(async () => {
      const info: StatusBarInfo = await StatusBar.getInfo();
      if (info.visible) {
        await StatusBar.hide();
      }
    });
  }
}
