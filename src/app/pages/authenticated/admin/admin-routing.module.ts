import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MailComponent } from "./mail/mail.component";
import { UserManagementComponent } from "./usermanagement/usermanagement.component";
import { WebhooksComponent } from "./webhooks/webhooks.component";

export const adminRoutes: Routes = [
  { path: '', redirectTo: 'usermanagement' },
  { path: 'usermanagement', component: UserManagementComponent },
  { path: 'webhooks', component: WebhooksComponent },
  { path: 'mail', component: MailComponent },
];

@NgModule({
  imports: [RouterModule.forChild(adminRoutes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }