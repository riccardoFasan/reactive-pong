import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CreditsRoutingModule } from './credits-routing.module';
import { SharedModule } from '../shared/shared.module';
import { CreditsComponent } from './components';

@NgModule({
  declarations: [CreditsComponent],
  imports: [CreditsRoutingModule, CommonModule, SharedModule],
})
export class CreditsModule {}
