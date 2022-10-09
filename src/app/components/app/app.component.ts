import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { StatusBar, StatusBarInfo } from '@capacitor/status-bar';
import { Platform } from '@ionic/angular';
import { interval } from 'rxjs';
import { NavigationStoreService } from 'src/app/shared/services';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {
  hasStyleBeenAdjusted: boolean = false;

  private subSink: SubSink = new SubSink();

  constructor(
    private orientation: ScreenOrientation,
    private platform: Platform,
    private navigationStore: NavigationStoreService
  ) {}

  ngOnInit(): void {
    this.navigationStore.startTracking();
  }

  async ngAfterViewInit(): Promise<void> {
    await this.adjustStyle();
    this.hasStyleBeenAdjusted = true;
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
    this.navigationStore.stopTracking();
  }

  private async adjustStyle(): Promise<void> {
    try {
      await this.autoHideStatusBar();
      await this.setOrientation();
    } catch {}
  }

  private async setOrientation(): Promise<void> {
    await this.orientation.lock(this.orientation.ORIENTATIONS.LANDSCAPE);
  }

  private async autoHideStatusBar(): Promise<void> {
    if (this.platform.is('android')) {
      await StatusBar.setOverlaysWebView({ overlay: true });
    }
    this.subSink.sink = interval(3000).subscribe(async () => {
      const info: StatusBarInfo = await StatusBar.getInfo();
      if (info.visible) {
        await StatusBar.hide();
      }
    });
  }
}
