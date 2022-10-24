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
      name: 'Play',
      url: ['/', 'game', 'level'],
    },
    {
      name: 'Settings',
      url: ['/', 'settings'],
    },
  ];

  quit(): void {
    App.exitApp();
  }
}
