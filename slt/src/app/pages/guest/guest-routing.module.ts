import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material.module';

import { AboutComponent } from './about/about.component';
import { GuestGuard } from './guest.guard';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';

export const guestRoutes: Routes = [
  {
    path: '',
    component: HomeComponent, canActivate: [GuestGuard]
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    RouterModule.forChild(guestRoutes)],
  providers: [GuestGuard],
  declarations: [
    HomeComponent,
    AboutComponent,
    LoginComponent
  ],
  exports: [
    RouterModule
  ]
})
export class GuestRoutingModule { }