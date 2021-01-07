import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './components/slider/slider.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    SliderComponent,
  ],
  imports: [
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
  ], 
  exports: [
    SliderComponent,
  ]
})
export class ComponentsModule { }
