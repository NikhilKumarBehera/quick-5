import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MemoryGameComponent } from './memory-game.component';

const routes: Routes = [
  {
    path: '',
    component: MemoryGameComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MemoryGameRoutingModule { }
