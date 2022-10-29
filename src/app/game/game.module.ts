import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { GameRoutingModule } from './game-routing.module';

import {
  PlayGroundComponent,
  PaddleComponent,
  BallComponent,
  PlayPauseControlComponent,
  ArtifactComponent,
  ShieldComponent,
  LevelComponent,
  ScoreComponent,
} from './components';

import {
  UserControllerDirective,
  ComputerControllerDirective,
  BaseControllerDirective,
  RandomArtifactsGeneratorDirective,
  ResizePaddleDirective,
} from './directives';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    PaddleComponent,
    LevelComponent,
    PlayGroundComponent,
    BallComponent,
    PlayPauseControlComponent,
    ArtifactComponent,
    ShieldComponent,
    ScoreComponent,
    UserControllerDirective,
    ComputerControllerDirective,
    BaseControllerDirective,
    RandomArtifactsGeneratorDirective,
    ResizePaddleDirective,
  ],
  imports: [CommonModule, IonicModule, GameRoutingModule, SharedModule],
})
export class GameModule {}
