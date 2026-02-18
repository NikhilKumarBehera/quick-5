import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { MemoryGameComponent } from './memory-game.component';

@NgModule({
  declarations: [MemoryGameComponent],
  imports: [CommonModule, IonicModule],
  exports: [MemoryGameComponent],
})
export class MemoryGameModule {}
