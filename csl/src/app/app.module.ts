import {BrowserModule}from'@angular/platform-browser';
import {NgModule}from '@angular/core';
import {FormsModule}from '@angular/forms';
import {HttpClientModule}from '@angular/common/http';
import {RouterModule, Routes}from '@angular/router';

import {BrowserAnimationsModule}from '@angular/platform-browser/animations';

import {AppComponent}from './app.component';
import {FoodService}from './services/food.service';
import {LogComponent}from './components/log/log.component';
import {FoodComponent}from './components/food/food.component';
import {FoodAliasComponent}from './components/food/foodalias/foodalias.component';
import {DatabaseComponent}from './components/database/database.component';
import {DatabaseEntryComponent}from './components/database/database-entry/database-entry.component';
import {AccountComponent}from './components/account/account.component';
import { SliderComponent } from './components/slider/slider.component';
0
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
  ],
  imports: [
    BrowserModule,
    FormsModule,
	HttpClientModule,
    RouterModule.forRoot(appRoutes),
    BrowserAnimationsModule
  ],
  providers: [FoodService],
  bootstrap: [AppComponent],
  entryComponents: [
  	DatabaseEntryComponent,
	DatabaseComponent
  ]
})
export class AppModule { }
