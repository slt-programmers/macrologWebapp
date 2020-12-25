import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/guest/guest.module').then((m) => m.GuestModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./pages/authenticated/authenticated.module').then(
        (m) => m.AuthenticatedModule
      ),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
