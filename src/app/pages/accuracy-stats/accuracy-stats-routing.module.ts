import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AccuracyStatsPage } from './accuracy-stats.page';

const routes: Routes = [
  {
    path: '',
    component: AccuracyStatsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AccuracyStatsPageRoutingModule {}
