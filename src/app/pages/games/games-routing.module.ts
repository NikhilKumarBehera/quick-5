import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { GamesPage } from './games.page';

const routes: Routes = [
  {
    path: '',
    component: GamesPage
  },
  {
    path: 'number-tap',
    loadChildren: () => import('./number-tap/number-tap.module').then( m => m.NumberTapPageModule)
  },
  {
    path: 'hangman',
    loadChildren: () => import('./hangman/hangman.module').then( m => m.HangmanPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class GamesPageRoutingModule {}
