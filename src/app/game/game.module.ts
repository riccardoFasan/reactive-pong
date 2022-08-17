import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GameRoutingModule } from './game-routing.module';
import {
  ComputerPaddleComponent,
  FieldComponent,
  PaddleComponent,
  UserPaddleComponent,
} from './components';

@NgModule({
  declarations: [
    PaddleComponent,
    UserPaddleComponent,
    ComputerPaddleComponent,
    FieldComponent,
  ],
  imports: [CommonModule, IonicModule, GameRoutingModule],
})
export class GameModule {}
