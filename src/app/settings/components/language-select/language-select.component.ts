import { ChangeDetectionStrategy, Component } from '@angular/core';
import { TranslationsService } from 'src/app/shared/services';
import { Option } from '../../models';

@Component({
  selector: 'app-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LanguageSelectComponent {
  languages: Option[] = [
    { label: 'ITALIAN', value: 'it' },
    { label: 'ENGLISH', value: 'en' },
    { label: 'GERMAN', value: 'de' },
    { label: 'SPANISH', value: 'es' },
    { label: 'FRENCH', value: 'fr' },
  ];

  currentLanguage: string = this.i18n.currentLanguage;

  constructor(private i18n: TranslationsService) {}

  setLanguage(language: string): void {
    this.i18n.setLanguage(language);
  }
}
