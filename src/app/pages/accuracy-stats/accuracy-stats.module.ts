import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AccuracyStatsPageRoutingModule } from './accuracy-stats-routing.module';

import { AccuracyStatsPage } from './accuracy-stats.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AccuracyStatsPageRoutingModule
  ],
  declarations: [AccuracyStatsPage]
})
export class AccuracyStatsPageModule {}
