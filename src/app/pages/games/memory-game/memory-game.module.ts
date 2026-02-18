import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IonicModule } from '@ionic/angular';

import { MemoryGamePageRoutingModule } from './memory-game-routing.module';

import { MemoryGamePage } from './memory-game.page';
import { MemoryGameComponent } from 'src/app/shared/components/memory-game/memory-game.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MemoryGamePageRoutingModule,
    MemoryGameComponent
  ],
  declarations: [ MemoryGamePage ]
})
export class MemoryGameModule { }
