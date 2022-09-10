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
  ShieldComponent,
} from './components';

import {
  UserControllerDirective,
  ComputerControllerDirective,
  BaseControllerDirective,
  RandomArtifactsGeneratorDirective,
  ResizePaddleDirective,
} from './directives';

@NgModule({
  declarations: [
    PaddleComponent,
    PlayGroundComponent,
    BallComponent,
    GameBarComponent,
    ArtifactComponent,
    ShieldComponent,
    UserControllerDirective,
    ComputerControllerDirective,
    BaseControllerDirective,
    RandomArtifactsGeneratorDirective,
    ResizePaddleDirective,
  ],
  imports: [CommonModule, IonicModule, GameRoutingModule],
})
export class GameModule {}
