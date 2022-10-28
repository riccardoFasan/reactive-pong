import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Theme } from '../enums';
import { PreferencesService } from './preferences.service';

@Injectable({
  providedIn: 'root',
})
export class ThemeManagerService {
  private themeStore$: BehaviorSubject<Theme> = new BehaviorSubject<Theme>(
    Theme.Retro
  );

  themeChange$: Observable<Theme> = this.themeStore$.asObservable();

  themeClass$: Observable<string> = this.themeStore$.pipe(
    map((theme: Theme) => this.getThemeClass(theme))
  );

  constructor(private preferences: PreferencesService) {
    this.loadPreference();
  }

  get theme(): Theme {
    return this.themeStore$.getValue();
  }

  set theme(theme: Theme) {
    this.themeStore$.next(theme);
    this.savePreference();
  }

  private getThemeClass(theme: Theme): string {
    return `${theme.toLowerCase()}-theme`;
  }

  private async loadPreference(): Promise<void> {
    const defaultTheme: Theme | null = await this.preferences.getTheme();
    if (defaultTheme) this.theme = defaultTheme;
  }

  private savePreference(): void {
    this.preferences.setTheme(this.theme);
  }
}
