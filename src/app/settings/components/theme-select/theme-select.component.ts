import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Observable } from 'rxjs';
import { Theme } from 'src/app/shared/enums';
import { ThemeManagerService } from 'src/app/shared/services';
import { Option } from '../../models';

@Component({
  selector: 'app-theme-select',
  templateUrl: './theme-select.component.html',
  styleUrls: ['./theme-select.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSelectComponent {
  themes: Option[] = [
    { label: 'Dory', value: Theme.Dory },
    { label: 'Retro', value: Theme.Retro },
  ];

  theme$: Observable<Theme> = this.themeManager.themeChange$;

  constructor(private themeManager: ThemeManagerService) {}

  setTheme(theme: Theme): void {
    this.themeManager.theme = theme;
  }
}
