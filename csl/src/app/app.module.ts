import {BrowserModule}from'@angular/platform-browser';
import {NgModule}from '@angular/core';
import {FormsModule}from '@angular/forms';
import {HttpClientModule}from '@angular/common/http';
import {RouterModule, Routes}from '@angular/router';

import {BrowserAnimationsModule}from '@angular/platform-browser/animations';

import {AppComponent}from './app.component';
import {FoodService}from './services/food.service';
import {LogComponent}from './pages/log/log.component';
import {FoodComponent}from './pages/food/food.component';
import {LogService}from './services/log.service';
import {FoodAliasComponent}from './components/foodalias/foodalias.component';
import {DatabaseComponent}from './pages/database/database.component';
import {DatabaseEntryComponent}from './components/database-entry/database-entry.component';
import {AccountComponent}from './pages/account/account.component';
import { SliderComponent } from './components/slider/slider.component';
import { BargraphComponent } from './components/bargraph/bargraph.component';

const appRoutes: Routes = [
{path: 'log', component: LogComponent},
{path: 'food', component: FoodComponent},
{path: 'foodalias', component: FoodAliasComponent},
{path: 'database', component: DatabaseComponent},
{path: 'account', component: AccountComponent},
{path: '', redirectTo: '/log', pathMatch: 'full'},
{path: '**', component: LogComponent}
];

@NgModule({
  declarations: [
    AppComponent,
    LogComponent,
    FoodComponent,
    FoodAliasComponent,
    DatabaseComponent,
    DatabaseEntryComponent,
    AccountComponent,
    SliderComponent,
    BargraphComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
		HttpClientModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule
  ],
  providers: [FoodService, LogService],
  bootstrap: [AppComponent],
  entryComponents: [
  	DatabaseEntryComponent,
	DatabaseComponent
  ]
})
export class AppModule { }
