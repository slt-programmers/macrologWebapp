import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

export const adminRoutes: Routes = [
  { path: '', redirectTo: 'usermanagement', pathMatch: 'full' },
  { path: 'usermanagement', loadComponent: () => import('./usermanagement/usermanagement.component').then(m => m.UserManagementComponent) },
  { path: 'webhooks', loadComponent: () => import('./webhooks/webhooks.component').then(m => m.WebhooksComponent) },
  { path: 'mail', loadComponent: () => import('./mail/mail.component').then(m => m.MailComponent) },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }