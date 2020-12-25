import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { FoodService } from './services/food.service';
import { ToastService } from './services/toast.service';
import { DiaryService } from './services/diary.service';
import { UserService } from './services/user.service';
import { DishService } from './services/dish.service';
import { WeightService } from './services/weight.service';
import { ActivityService } from './services/activity.service';
import { HealthcheckService } from './services/healthcheck.service';
import { ScrollBehaviourService } from './services/scroll-behaviour.service';
import { AdminService } from './services/admin.service';
import { GoogleService } from './services/google.service';
import { WebhookService } from './services/webhook.service';

import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AuthenticatedModule } from './pages/authenticated/authenticated.module';
import { GuestModule } from './pages/guest/guest.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    AuthenticatedModule,
    GuestModule,
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
    ScrollBehaviourService,
    HealthcheckService,
    WebhookService,
    GoogleService,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [],
})
export class AppModule {}
