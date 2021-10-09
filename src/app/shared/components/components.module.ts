import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider/slider.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationComponent } from './navigation/navigation.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [
    SliderComponent,
    NavigationComponent,
  ],
  imports: [
    RouterModule,
    CommonModule, 
    FormsModule,
    ReactiveFormsModule,
  ], 
  exports: [
    SliderComponent,
    NavigationComponent,
  ]
})
export class ComponentsModule { }
