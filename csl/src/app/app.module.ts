import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatListModule } from '@angular/material/list';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { FoodService } from './services/food.service';
import { LogComponent } from './components/log/log.component';
import { DatabaseComponent } from './components/database/database.component';
import { DatabaseEntryComponent } from './components/database/database-entry/database-entry.component';

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
    DatabaseComponent,
    DatabaseEntryComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
	HttpClientModule,
    RouterModule.forRoot(appRoutes),
    MatToolbarModule,
    MatFormFieldModule,
    MatSidenavModule,
    MatInputModule,
    MatRadioModule,
    MatCardModule,
    MatDividerModule,
    MatListModule,
    MatGridListModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
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
