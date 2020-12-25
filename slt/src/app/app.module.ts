import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';

import { FoodService } from './shared/services/food.service';
import { ToastService } from './shared/services/toast.service';
import { DiaryService } from './shared/services/diary.service';
import { UserService } from './shared/services/user.service';
import { DishService } from './shared/services/dish.service';
import { WeightService } from './shared/services/weight.service';
import { ActivityService } from './shared/services/activity.service';
import { HealthcheckService } from './shared/services/healthcheck.service';
import { ScrollBehaviourService } from './shared/services/scroll-behaviour.service';
import { AdminService } from './shared/services/admin.service';
import { GoogleService } from './shared/services/google.service';
import { WebhookService } from './shared/services/webhook.service';

import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { ErrorInterceptor } from './interceptors/error.interceptor';
import { AuthenticatedModule } from './pages/authenticated/authenticated.module';
import { GuestModule } from './pages/guest/guest.module';
import { SharedModule } from './shared/shared.module';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/guest/guest.module').then((m) => m.GuestModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/authenticated/authenticated.module').then(
        (m) => m.AuthenticatedModule
      ),
  },
];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    BrowserAnimationsModule,
    SharedModule,
    AuthenticatedModule,
    GuestModule,
    RouterModule.forRoot(routes),
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
