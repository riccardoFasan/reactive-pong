import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GameRoutingModule } from './game-routing.module';

import {
  PlayGroundComponent,
  PaddleComponent,
  BallComponent,
} from './components';

import {
  UserControllerDirective,
  ComputerControllerDirective,
  BaseControllerDirective,
} from './directives';

@NgModule({
  declarations: [
    PaddleComponent,
    PlayGroundComponent,
    BallComponent,
    UserControllerDirective,
    ComputerControllerDirective,
    BaseControllerDirective,
  ],
  imports: [CommonModule, IonicModule, GameRoutingModule],
})
export class GameModule {}
