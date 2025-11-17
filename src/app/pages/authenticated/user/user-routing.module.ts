import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

export const userRoutes: Routes = [
  { path: '', redirectTo: 'personal', pathMatch: 'full' },
  { path: 'personal', loadComponent: () => import('./personal/personal.component').then(m => m.PersonalComponent) },
  { path: 'foodintake', loadComponent: () => import('./intake/intake.component').then(m => m.IntakeComponent) },
  { path: 'weighttracker', loadComponent: () => import('./weighttracker/weighttracker.component').then(m => m.WeightTrackerComponent) },
  { path: 'connectivity', loadComponent: () => import('./connectivity/connectivity.component').then(m => m.ConnectivityComponent) },
  { path: 'account', loadComponent: () => import('./account/account.component').then(m => m.AccountComponent) },
];

@NgModule({
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }