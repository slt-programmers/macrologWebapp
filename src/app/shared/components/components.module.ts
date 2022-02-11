import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationComponent } from './navigation/navigation.component';
import { RouterModule } from '@angular/router';
import { ModalComponent } from './modal/modal.component';
import { BargraphComponent } from './bargraph/bargraph.component';
import { LinegraphComponent } from './linegraph/linegraph.component';
import { DatepickerComponent } from './datepicker/datepicker.component';
import { PiechartComponent } from './piechart/piechart.component';
import { StackDonutComponent } from './stackdonut/stackdonut.component';
import { StepperComponent } from './stepper/stepper.component';
import { AutocompleteFoodComponent } from './autocomplete-food/autocomplete-food.component';
@NgModule({
  declarations: [
    NavigationComponent,
    ModalComponent,
    AutocompleteFoodComponent,
    BargraphComponent,
    LinegraphComponent,
    DatepickerComponent,
    PiechartComponent,
    StackDonutComponent,
    StepperComponent,
  ],
  imports: [
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    NavigationComponent,
    ModalComponent,
    AutocompleteFoodComponent,
    BargraphComponent,
    LinegraphComponent,
    DatepickerComponent,
    PiechartComponent,
    StackDonutComponent,
    StepperComponent,
  ]
})
export class ComponentsModule { }
