import { ChangeDetectionStrategy, Component } from '@angular/core';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  readonly pages: { name: string; url: string[] }[] = [
    {
      name: 'PLAY',
      url: ['/', 'game', 'level'],
    },
    {
      name: 'SETTINGS',
      url: ['/', 'settings'],
    },
    {
      name: 'CREDITS',
      url: ['/', 'credits'],
    },
  ];

  quit(): void {
    App.exitApp();
  }
}
