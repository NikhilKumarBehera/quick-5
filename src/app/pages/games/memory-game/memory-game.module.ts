import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MemoryGameComponent } from './memory-game.component';
import { MemoryGameRoutingModule } from './memory-game-routing.module';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    MemoryGameRoutingModule
  ],
  declarations: [MemoryGameComponent]
})
export class MemoryGameModule { }
