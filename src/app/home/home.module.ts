import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './components';

@NgModule({
  declarations: [HomeComponent],
  imports: [CommonModule, IonicModule, HomeRoutingModule],
})
export class HomeModule {}
