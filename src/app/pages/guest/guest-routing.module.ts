import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GuestGuard } from './guest.guard';

export const guestRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about.component').then(m => m.AboutComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./login/login.component').then(m => m.LoginComponent),
    canActivate: [GuestGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(guestRoutes)],
  providers: [GuestGuard],
  exports: [RouterModule]
})
export class GuestRoutingModule { }