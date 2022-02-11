import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/guest/guest.module').then(m => m.GuestModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/authenticated/authenticated.module').then(m => m.AuthenticatedModule),
  },
  {
    path: '**',
    component: PageNotFoundComponent
  }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
