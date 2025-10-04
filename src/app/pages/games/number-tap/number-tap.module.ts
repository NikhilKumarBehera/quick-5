import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { NumberTapPageRoutingModule } from './number-tap-routing.module';

import { NumberTapPage } from './number-tap.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    NumberTapPageRoutingModule
  ],
  declarations: [NumberTapPage]
})
export class NumberTapPageModule {}
