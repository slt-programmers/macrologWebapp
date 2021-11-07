import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SliderComponent } from './slider/slider.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationComponent } from './navigation/navigation.component';
import { RouterModule } from '@angular/router';
import { ModalComponent } from './modal/modal.component';

@NgModule({
  declarations: [
    SliderComponent,
    NavigationComponent,
    ModalComponent
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
    ModalComponent,
  ]
})
export class ComponentsModule { }
