import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { JwtInterceptor } from './shared/interceptors/jwt.interceptor';
import { ErrorInterceptor } from './shared/interceptors/error.interceptor';
import { ToastComponent } from './shared/components/toast/toast.component';
import { ServicesModule } from './shared/services.module';
import { ComponentsModule } from './shared/components/components.module';
import { StoreModule } from '@ngrx/store';
import { reducers } from './shared/store/reducers';

@NgModule({
  declarations: [
    AppComponent,
    ToastComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ServicesModule,
    AppRoutingModule,
    ComponentsModule,
    StoreModule.forRoot(reducers),
  ],
  providers: [
    { provide: Window, useValue: window},
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
