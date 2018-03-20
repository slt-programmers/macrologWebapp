import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FoodService } from './services/food.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
	HttpClientModule,
	MatToolbarModule,
	MatSidenavModule,
	BrowserAnimationsModule
  ],
  providers: [FoodService],
  bootstrap: [AppComponent]
})
export class AppModule { }
