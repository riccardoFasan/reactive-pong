import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { GameRoutingModule } from './game-routing.module';
import { NativeAudio } from '@awesome-cordova-plugins/native-audio/ngx';

import {
  PlayGroundComponent,
  PaddleComponent,
  BallComponent,
  GameBarComponent,
  ArtifactComponent,
  ShieldComponent,
  LevelComponent,
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
    GameBarComponent,
    ArtifactComponent,
    ShieldComponent,
    UserControllerDirective,
    ComputerControllerDirective,
    BaseControllerDirective,
    RandomArtifactsGeneratorDirective,
    ResizePaddleDirective,
  ],
  imports: [CommonModule, IonicModule, GameRoutingModule, SharedModule],
  providers: [NativeAudio],
})
export class GameModule {}
