import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';

import { RouterModule, Routes } from '@angular/router';

import { GuestGuard } from '../../services/guest.guard';
import { SharedModule } from 'src/app/shared/shared.module';

export const guestRoutes: Routes = [
  { path: '', component: HomeComponent, canActivate: [GuestGuard] },
  { path: 'about', component: AboutComponent },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [GuestGuard],
  },
];

@NgModule({
  declarations: [LoginComponent, HomeComponent, AboutComponent],
  providers: [GuestGuard],
  imports: [CommonModule, SharedModule, RouterModule.forChild(guestRoutes)],
})
export class GuestModule {}
