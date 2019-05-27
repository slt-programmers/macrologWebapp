import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FoodService } from './services/food.service';
import { ToastService } from './services/toast.service';
import { ToastDirective } from './directives/toast.directive';
import { ToastComponent } from './components/toast/toast.component';
import { LogComponent } from './pages/log/log.component';
import { LogMealComponent } from './components/log-meal/log-meal.component';
import { LogActivityComponent } from './components/log-activity/log-activity.component';
import { FoodComponent } from './pages/food/food.component';
import { LogService } from './services/log.service';
import { UserComponent } from './pages/user/user.component';
import { UserIntakeComponent } from './pages/user/subpages/user.intake.component';
import { UserPersonalComponent } from './pages/user/subpages/user.personal.component';
import { UserAccountComponent } from './pages/user/subpages/user.account.component';
import { UserService } from './services/user.service';
import { SliderComponent } from './components/slider/slider.component';
import { BargraphComponent } from './components/bargraph/bargraph.component';
import { AddFoodModalComponent } from './components/add-food-modal/add-food-modal.component';
import { CalculateIntakeModalComponent } from './components/calculate-intake-modal/calculate-intake-modal.component';
import { MealsComponent } from './pages/meals/meals.component';
import { GraphsComponent } from './pages/graphs/graphs.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { PagerComponent } from './components/pager/pager.component';
import { MakeMealModalComponent } from './components/make-meal-modal/make-meal-modal.component';
import { AutocompleteFoodComponent } from './components/autocomplete-food/autocomplete-food.component';
import { LoginComponent } from './pages/login/login.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { MealService } from './services/meal.service';
import { ActivityService } from './services/activity.service';
import { PiechartComponent } from './components/piechart/piechart.component';
import { IntakeComponent } from './pages/intake/intake.component';
import { StepperComponent } from './components/stepper/stepper.component';
import { AuthGuardService } from './services/auth-guard.service';
import { ScrollBehaviourService } from './services/scroll-behaviour.service';
import { HealthcheckService } from './services/healthcheck.service';

const appRoutes: Routes = [
	{path: 'login', component: LoginComponent },
	{path: 'log', component: LogComponent, canActivate: [AuthGuardService]},
	{
		path: 'user',
		component: UserComponent,
		canActivate: [AuthGuardService],
		children: [
			{path: '', redirectTo: 'foodintake', pathMatch: 'full'},
			{path: 'foodintake', component: UserIntakeComponent},
			{path: 'personal', component: UserPersonalComponent},
			{path: 'account', component: UserAccountComponent}
		]
	},
	{path: 'intake', component: IntakeComponent, canActivate: [AuthGuardService]},
	{path: 'food', component: FoodComponent, canActivate: [AuthGuardService]},
	{path: 'meals', component: MealsComponent, canActivate: [AuthGuardService]},
  	// {path: 'graphs', component: GraphsComponent},
	{path: '', redirectTo: '/log', pathMatch: 'full', canActivate: [AuthGuardService]},
	{path: '**', redirectTo: '/log', pathMatch: 'full', canActivate: [AuthGuardService]}
];

@NgModule({
	declarations: [
		AppComponent,
		LogComponent,
		LogMealComponent,
    LogActivityComponent,
		FoodComponent,
		UserComponent,
		UserIntakeComponent,
		UserPersonalComponent,
		UserAccountComponent,
		SliderComponent,
		BargraphComponent,
		AddFoodModalComponent,
		CalculateIntakeModalComponent,
		MealsComponent,
		GraphsComponent,
		DatepickerComponent,
		ToastComponent,
		ToastDirective,
		LoginComponent,
		PagerComponent,
		MakeMealModalComponent,
		AutocompleteFoodComponent,
		PiechartComponent,
		IntakeComponent,
		StepperComponent,
	],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		FormsModule,
		HttpClientModule,
		RouterModule.forRoot(appRoutes),
		BrowserAnimationsModule
	],
	providers: [
    ActivityService,
		FoodService,
		LogService,
		UserService,
		ToastService,
		MealService,
		AuthGuardService,
		ScrollBehaviourService,
		HealthcheckService,
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
	],
	bootstrap: [AppComponent],
	entryComponents: []
})
export class AppModule { }
