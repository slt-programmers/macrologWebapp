import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { ToastComponent } from './shared/components/toast/toast.component';
import { HealthcheckService } from './shared/services/healthcheck.service';
import { ToastService } from './shared/services/toast.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FoodService } from './shared/services/food.service';
import { UserService } from './shared/services/user.service';
import { ScrollBehaviourService } from './shared/services/scroll-behaviour.service';
import { DiaryService } from './shared/services/diary.service';
import { ActivityService } from './shared/services/activity.service';
import { DishService } from './shared/services/dish.service';
import { ServicesModule } from './shared/services.module';

@NgModule({
  declarations: [
    AppComponent,
    ToastComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ServicesModule,
    AppRoutingModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
