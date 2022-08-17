import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GameRoutingModule } from './game-routing.module';

import {
  FieldComponent,
  PaddleComponent,
  UserPaddleComponent,
  ComputerPaddleComponent,
} from './components';

import {
  UserControllerDirective,
  ComputerControllerDirective,
} from './directives';

@NgModule({
  declarations: [
    PaddleComponent,
    UserPaddleComponent,
    ComputerPaddleComponent,
    FieldComponent,
    UserControllerDirective,
    ComputerControllerDirective,
  ],
  imports: [CommonModule, IonicModule, GameRoutingModule],
})
export class GameModule {}
