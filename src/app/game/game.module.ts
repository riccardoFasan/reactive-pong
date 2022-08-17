import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { GameRoutingModule } from './game-routing.module';

import { FieldComponent, PaddleComponent } from './components';

import {
  UserControllerDirective,
  ComputerControllerDirective,
} from './directives';
import { BaseControllerDirective } from './directives/base-controller.directive';

@NgModule({
  declarations: [
    PaddleComponent,
    FieldComponent,
    UserControllerDirective,
    ComputerControllerDirective,
    BaseControllerDirective,
  ],
  imports: [CommonModule, IonicModule, GameRoutingModule],
})
export class GameModule {}
