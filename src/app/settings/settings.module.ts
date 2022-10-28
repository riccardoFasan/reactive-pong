import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import {
  HalfFieldSelectComponent,
  SelectComponent,
  SettingsComponent,
  ThemeSelectComponent,
  LanguageSelectComponent,
  SoundSwitchComponent,
} from './components';

@NgModule({
  declarations: [
    SettingsComponent,
    SelectComponent,
    HalfFieldSelectComponent,
    ThemeSelectComponent,
    LanguageSelectComponent,
    SoundSwitchComponent,
  ],
  imports: [CommonModule, IonicModule, SettingsRoutingModule, SharedModule],
})
export class SettingsModule {}
