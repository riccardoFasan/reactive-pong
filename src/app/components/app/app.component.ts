import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
} from '@angular/core';
import { ScreenOrientation } from '@awesome-cordova-plugins/screen-orientation/ngx';
import { StatusBar, StatusBarInfo } from '@capacitor/status-bar';
import { NavigationBar } from '@hugotomazi/capacitor-navigation-bar';
import { Platform } from '@ionic/angular';
import { interval, Observable } from 'rxjs';
import { ThemeManagerService } from 'src/app/shared/services';
import { SubSink } from 'subsink';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
})
export class AppComponent implements AfterViewInit, OnDestroy {
  hasStyleBeenAdjusted: boolean = false;

  theme$: Observable<string> = this.themeManager.themeClass$;

  private subSink: SubSink = new SubSink();

  constructor(
    private orientation: ScreenOrientation,
    private platform: Platform,
    private themeManager: ThemeManagerService,
    private cdr: ChangeDetectorRef
  ) {}

  async ngAfterViewInit(): Promise<void> {
    await this.adjustStyle();
    this.hasStyleBeenAdjusted = true;
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {
    this.subSink.unsubscribe();
  }

  private async adjustStyle(): Promise<void> {
    try {
      await Promise.all([
        this.setOrientation(),
        this.autoHideStatusBar(),
        this.hideNavigationBar(),
      ]);
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

  private async hideNavigationBar(): Promise<void> {
    if (this.platform.is('android')) {
      await NavigationBar.hide();
    }
  }
}
