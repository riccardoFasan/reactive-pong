import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PreferencesService } from './preferences.service';

@Injectable({
  providedIn: 'root',
})
export class TranslationsService {
  currentLanguage!: string;

  readonly languages: string[] = ['it', 'en', 'de', 'es', 'fr'];
  private readonly defaultLanguage: string = 'en';

  constructor(
    private translate: TranslateService,
    private preferences: PreferencesService
  ) {}

  async init(): Promise<void> {
    this.currentLanguage = await this.getSavedLanguageOrDefault();
    this.setLanguage(this.currentLanguage);
  }

  async setLanguage(code: string): Promise<void> {
    if (this.languages.includes(code)) {
      this.translate.use(code);
      this.translate.setDefaultLang(code);
      this.currentLanguage = code;
      await this.preferences.setLanguage(code);
    }
  }

  private async getSavedLanguageOrDefault(): Promise<string> {
    return (await this.preferences.getLanguage()) || this.defaultLanguage;
  }
}
