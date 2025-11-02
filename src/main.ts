import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { JwtInterceptor } from './app/shared/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './app/shared/interceptors/error.interceptor';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { ServicesModule } from './app/shared/services.module';
import { AppRoutingModule } from './app/app-routing.module';
import { StoreModule } from '@ngrx/store';
import { reducers } from './app/shared/store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { FoodEffects } from './app/shared/store/effects/food.effects';
import { DishesEffects } from './app/shared/store/effects/dishes.effects';
import { EntriesEffects } from './app/shared/store/effects/entries.effects';
import { ActivitiesEffects } from './app/shared/store/effects/activities.effects';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserModule, ServicesModule, AppRoutingModule, StoreModule.forRoot(reducers), EffectsModule.forRoot([
      FoodEffects,
      DishesEffects,
      EntriesEffects,
      ActivitiesEffects
    ]), FontAwesomeModule),
    { provide: Window, useValue: window },
    { provide: Document, useValue: document },
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    provideHttpClient(withInterceptorsFromDi())
  ]
}).catch((err) => console.error(err));
