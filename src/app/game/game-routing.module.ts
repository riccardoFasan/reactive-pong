import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LevelComponent, PlayGroundComponent } from './components';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'level',
  },
  {
    path: 'pong',
    component: PlayGroundComponent,
  },
  {
    path: 'level',
    component: LevelComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GameRoutingModule {}
