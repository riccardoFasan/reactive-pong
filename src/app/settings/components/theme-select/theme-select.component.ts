import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Theme } from 'src/app/shared/enums';
import { ThemeManagerService } from 'src/app/shared/services';
import { environment } from 'src/environments/environment';
import { Option } from '../../models';

@Component({
  selector: 'app-theme-select',
  templateUrl: './theme-select.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeSelectComponent implements OnInit {
  themes: Option[] = [
    { label: 'Dracula', value: Theme.Dracula },
    { label: 'Retro', value: Theme.Retro },
  ];

  theme$: Observable<Theme> = this.themeManager.themeChange$;

  constructor(private themeManager: ThemeManagerService) {}

  ngOnInit(): void {
    if (!environment.production) {
      this.themes = [...this.themes, { label: 'Dory', value: Theme.Dory }];
    }
  }

  setTheme(theme: Theme): void {
    this.themeManager.theme = theme;
  }
}
