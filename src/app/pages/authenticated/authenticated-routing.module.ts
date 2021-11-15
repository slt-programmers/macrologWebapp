import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticatedComponent } from './authenticated.component';
import { DiaryComponent } from './diary/diary.component';
import { AdminComponent } from './admin/admin.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { FoodComponent } from './food/food.component';
import { DishesComponent } from './dishes/dishes.component';
import { GraphsComponent } from './graphs/graphs.component';
import { AuthGuard } from 'src/app/pages/authenticated/auth.guard';
import { UserComponent } from './user/user.component';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BargraphComponent } from 'src/app/shared/components/bargraph/bargraph.component';
import { AutocompleteFoodComponent } from 'src/app/shared/components/autocomplete-food/autocomplete-food.component';
import { PiechartComponent } from 'src/app/shared/components/piechart/piechart.component';
import { LogMealComponent } from 'src/app/shared/components/log-meal/log-meal.component';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { StepperComponent } from 'src/app/shared/components/stepper/stepper.component';
import { LogActivityComponent } from 'src/app/shared/components/log-activity/log-activity.component';
import { StackDonutComponent } from 'src/app/shared/components/stackdonut/stackdonut.component';
import { DatepickerComponent } from 'src/app/shared/components/datepicker/datepicker.component';
import { EditFoodComponent } from './food/edit-food/edit-food.component';

export const authenticatedRoutes: Routes = [
  {
    path: '',
    component: AuthenticatedComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DiaryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'user',
        component: UserComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule)
      },
      {
        path: 'onboarding',
        component: OnboardingComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'food',
        component: FoodComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'dishes',
        component: DishesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'graphs',
        component: GraphsComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    RouterModule.forChild(authenticatedRoutes)],
  declarations: [
    AuthenticatedComponent,
    DiaryComponent,
    UserComponent,
    AdminComponent,
    OnboardingComponent,
    FoodComponent,
    EditFoodComponent,
    DishesComponent,
    GraphsComponent,
    BargraphComponent,
    AutocompleteFoodComponent,
    PiechartComponent,
    LogMealComponent,
    StepperComponent,
    LogActivityComponent,
    StackDonutComponent,
    DatepickerComponent
  ],
  providers: [
    AuthGuard
  ],
  exports: [RouterModule],
})
export class AuthenticatedRoutingModule { }
