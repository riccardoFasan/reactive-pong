import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { GameRoutingModule } from './game-routing.module';

import {
  PlayGroundComponent,
  PaddleComponent,
  BallComponent,
  GameBarComponent,
  ArtifactComponent,
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
    ArtifactComponent,
    UserControllerDirective,
    ComputerControllerDirective,
    BaseControllerDirective,
    RandomArtifactsGeneratorDirective,
  ],
  imports: [CommonModule, IonicModule, GameRoutingModule],
})
export class GameModule {}
