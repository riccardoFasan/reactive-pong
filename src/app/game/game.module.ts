import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GameRoutingModule } from './game-routing.module';

import {
  PlayGroundComponent,
  PaddleComponent,
  BallComponent,
  GameBarComponent,
} from './components';

import {
  UserControllerDirective,
  ComputerControllerDirective,
  BaseControllerDirective,
  RandomArtifactsGeneratorDirective,
} from './directives';

@NgModule({
  declarations: [
    PaddleComponent,
    PlayGroundComponent,
    BallComponent,
    GameBarComponent,
    UserControllerDirective,
    ComputerControllerDirective,
    BaseControllerDirective,
    RandomArtifactsGeneratorDirective,
  ],
  imports: [CommonModule, IonicModule, GameRoutingModule],
})
export class GameModule {}
