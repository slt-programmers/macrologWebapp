import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuthenticatedRoutingModule } from './authenticated-routing.module';
import { AdminComponent } from './admin/admin.component';
import { DiaryComponent } from './diary/diary.component';
import { FoodComponent } from './food/food.component';
import { UserComponent } from './user/user.component';
import { UserManagementComponent } from './admin/usermanagement/usermanagement.component';
import { WebhooksComponent } from './admin/webhooks/webhooks.component';
import { MailComponent } from './admin/mail/mail.component';
import { IntakeComponent } from './user/intake/intake.component';
import { PersonalComponent } from './user/personal/personal.component';
import { AccountComponent } from './user/account/account.component';
import { WeightTrackerComponent } from './user/weighttracker/weighttracker.component';
import { ConnectivityComponent } from './user/connectivity/connectivity.component';
import { DishesComponent } from './dishes/dishes.component';
import { GraphsComponent } from './analytics/analytics.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { AuthenticatedComponent } from './authenticated.component';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { AddFoodModalComponent } from 'src/app/components/add-food-modal/add-food-modal.component';
import { AutocompleteFoodComponent } from 'src/app/components/autocomplete-food/autocomplete-food.component';
import { BargraphComponent } from 'src/app/components/bargraph/bargraph.component';
import { CalculateIntakeModalComponent } from 'src/app/components/calculate-intake-modal/calculate-intake-modal.component';
import { DatepickerComponent } from 'src/app/components/datepicker/datepicker.component';
import { LinegraphComponent } from 'src/app/components/linegraph/linegraph.component';
import { LogActivityComponent } from 'src/app/components/log-activity/log-activity.component';
import { LogMealComponent } from 'src/app/components/log-meal/log-meal.component';
import { MakeDishModalComponent } from 'src/app/components/make-dish-modal/make-dish-modal.component';
import { PiechartComponent } from 'src/app/components/piechart/piechart.component';
import { SliderComponent } from 'src/app/components/slider/slider.component';
import { StackDonutComponent } from 'src/app/components/stackdonut/stackdonut.component';
import { StepperComponent } from 'src/app/components/stepper/stepper.component';
import { ToastComponent } from 'src/app/components/toast/toast.component';
import { DateValidator } from 'src/app/directives/date.directive';
import { ToastDirective } from 'src/app/directives/toast.directive';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    FormsModule,
    AuthenticatedRoutingModule,
    MatIconModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatTableModule,
  ],
  declarations: [
    AuthenticatedComponent,
    AdminComponent,
    DiaryComponent,
    LogMealComponent,
    LogActivityComponent,
    FoodComponent,
    UserComponent,
    UserManagementComponent,
    WebhooksComponent,
    MailComponent,
    IntakeComponent,
    PersonalComponent,
    AccountComponent,
    WeightTrackerComponent,
    ConnectivityComponent,
    SliderComponent,
    AddFoodModalComponent,
    CalculateIntakeModalComponent,
    DishesComponent,
    GraphsComponent,
    DatepickerComponent,
    ToastComponent,
    ToastDirective,
    DateValidator,
    MakeDishModalComponent,
    AutocompleteFoodComponent,
    PiechartComponent,
    StackDonutComponent,
    OnboardingComponent,
    StepperComponent,
    LinegraphComponent,
    BargraphComponent,
  ],
})
export class AuthenticatedModule {}
