import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';

import { LinegraphComponent } from './components/linegraph/linegraph.component';
import { AddFoodModalComponent } from './components/add-food-modal/add-food-modal.component';
import { AutocompleteFoodComponent } from './components/autocomplete-food/autocomplete-food.component';
import { BargraphComponent } from './components/bargraph/bargraph.component';
import { CalculateIntakeModalComponent } from './components/calculate-intake-modal/calculate-intake-modal.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { DateValidator } from 'src/app/directives/date.directive';

import { LogActivityComponent } from './components/log-activity/log-activity.component';
import { LogMealComponent } from './components/log-meal/log-meal.component';
import { MakeDishModalComponent } from './components/make-dish-modal/make-dish-modal.component';
import { PiechartComponent } from './components/piechart/piechart.component';
import { SliderComponent } from './components/slider/slider.component';
import { StackDonutComponent } from './components/stackdonut/stackdonut.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { ToastComponent } from './components/toast/toast.component';
import { ToastDirective } from 'src/app/directives/toast.directive';

@NgModule({
  declarations: [
    AddFoodModalComponent,
    AutocompleteFoodComponent,
    BargraphComponent,
    CalculateIntakeModalComponent,
    DatepickerComponent,
    DateValidator,
    LinegraphComponent,
    LogActivityComponent,
    LogMealComponent,
    MakeDishModalComponent,
    PiechartComponent,
    SliderComponent,
    StackDonutComponent,
    StepperComponent,
    ToastComponent,
    ToastDirective,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatTableModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatTableModule,

    AddFoodModalComponent,
    AutocompleteFoodComponent,
    BargraphComponent,
    CalculateIntakeModalComponent,
    DatepickerComponent,
    DateValidator,
    LinegraphComponent,
    LogActivityComponent,
    LogMealComponent,
    MakeDishModalComponent,
    PiechartComponent,
    SliderComponent,
    StackDonutComponent,
    StepperComponent,
    ToastComponent,
    ToastDirective,
  ],
})
export class SharedModule {}
