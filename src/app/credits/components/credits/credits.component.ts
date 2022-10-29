import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Browser } from '@capacitor/browser';

@Component({
  selector: 'app-credits',
  templateUrl: './credits.component.html',
  styleUrls: ['./credits.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreditsComponent {
  visitPayPal(): void {
    this.openInAppBrowser(
      'https://www.paypal.com/donate/?hosted_button_id=2RR27KLB9JBUU'
    );
  }

  visitGitHub(): void {
    this.openInAppBrowser('https://github.com/riccardoFasan/reactive-pong');
  }

  private async openInAppBrowser(url: string): Promise<void> {
    await Browser.open({ url });
  }
}
