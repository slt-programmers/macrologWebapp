import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatInputModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material';
import { MatButtonModule } from '@angular/material';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

import { AppComponent } from './app.component';
import { AboutComponent } from './pages/guest/about/about.component';
import { FoodService } from './services/food.service';
import { ToastService } from './services/toast.service';
import { ToastDirective } from './directives/toast.directive';
import { DateValidator } from './directives/date.directive';
import { ToastComponent } from './components/toast/toast.component';
import { DiaryComponent } from './pages/authenticated/diary/diary.component';
import { LogMealComponent } from './components/log-meal/log-meal.component';
import { LogActivityComponent } from './components/log-activity/log-activity.component';
import { FoodComponent } from './pages/authenticated/food/food.component';
import { DiaryService } from './services/diary.service';
import { UserComponent } from './pages/authenticated/user/user.component';
import { IntakeComponent } from './pages/authenticated/user/intake/intake.component';
import { PersonalComponent } from './pages/authenticated/user/personal/personal.component';
import { AccountComponent } from './pages/authenticated/user/account/account.component';
import { WeightTrackerComponent } from './pages/authenticated/user/weighttracker/weighttracker.component';
import { ConnectivityComponent } from './pages/authenticated/user/connectivity/connectivity.component';

import { UserService } from './services/user.service';
import { SliderComponent } from './components/slider/slider.component';
import { GoalProgressbarComponent } from './components/goal-progressbar/goal-progressbar.component';
import { CalorieProgressbarComponent } from './components/calorie-progressbar/calorie-progressbar.component';
import { AddFoodModalComponent } from './components/add-food-modal/add-food-modal.component';
import { CalculateIntakeModalComponent } from './components/calculate-intake-modal/calculate-intake-modal.component';
import { DishesComponent } from './pages/authenticated/dishes/dishes.component';
import { GraphsComponent } from './pages/authenticated/analytics/analytics.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { MakeDishModalComponent } from './components/make-dish-modal/make-dish-modal.component';
import { AutocompleteFoodComponent } from './components/autocomplete-food/autocomplete-food.component';
import { LoginComponent } from './pages/guest/login/login.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { DishService } from './services/dish.service';
import { ActivityService } from './services/activity.service';
import { WeightService } from './services/weight.service';
import { AuthGuardService } from './services/auth-guard.service';
import { ScrollBehaviourService } from './services/scroll-behaviour.service';
import { HealthcheckService } from './services/healthcheck.service';
import { AdminService } from './services/admin.service';
import { WebhookService } from './services/webhook.service'
import { BrandComponent } from './pages/brand/brand.component';
import { HomeComponent } from './pages/guest/home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticatedModule } from './pages/authenticated/authenticated.module';

@NgModule({
	declarations: [
		AppComponent,
		AboutComponent,
		LoginComponent,
		BrandComponent,
		HomeComponent
	],
	imports: [
		BrowserModule,
		ReactiveFormsModule,
		FormsModule,
		HttpClientModule,
		BrowserAnimationsModule,
		AppRoutingModule,
		AuthenticatedModule, 
		MatInputModule,
		MatFormFieldModule,
		MatButtonModule,
		MatIconModule,
		MatRippleModule
	],
	providers: [
		AdminService,
		ActivityService,
		FoodService,
		DiaryService,
		UserService,
		ToastService,
		DishService,
		WeightService,
		AuthGuardService,
		ScrollBehaviourService,
		HealthcheckService,
    WebhookService,
		{ provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
		{ provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
	],
	bootstrap: [AppComponent],
	entryComponents: []
})
export class AppModule { }
