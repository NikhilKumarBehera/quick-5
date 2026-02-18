/**
 * Shared Module
 * Central module for shared components, directives, and pipes
 * Import this module in feature modules that need shared functionality
 */

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [
    // TODO: Add shared components here
    // TODO: Add shared directives here
    // TODO: Add shared pipes here
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
  ],
  exports: [
    // Common Angular modules
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    // TODO: Export shared components
    // TODO: Export shared directives
    // TODO: Export shared pipes
  ],
})
export class SharedModule {}
