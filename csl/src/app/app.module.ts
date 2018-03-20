import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FoodService } from './services/food.service';
import { LogComponent } from './components/log/log.component';
import { DatabaseComponent } from './components/database/database.component';

const appRoutes: Routes = [
	{ path: 'log', component: LogComponent },
	{ path: 'database', component: DatabaseComponent },
	{ path: '', redirectTo: '/log', pathMatch: 'full' },
	{ path: '**', component: LogComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    LogComponent,
    DatabaseComponent
  ],
  imports: [
    BrowserModule,
	HttpClientModule,
	RouterModule.forRoot(appRoutes),
	MatToolbarModule,
	MatSidenavModule,
	MatCardModule,
	BrowserAnimationsModule
  ],
  providers: [FoodService],
  bootstrap: [AppComponent]
})
export class AppModule { }
