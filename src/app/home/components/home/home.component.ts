import { Component } from '@angular/core';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  readonly pages: { name: string; url: string[] }[] = [
    {
      name: 'Play',
      url: ['/', 'game', 'level'],
    },
  ];

  quit(): void {
    App.exitApp();
  }
}
