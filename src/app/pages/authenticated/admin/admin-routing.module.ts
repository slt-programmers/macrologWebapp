import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { MailComponent } from "./mail/mail.component";
import { UserManagementComponent } from "./usermanagement/usermanagement.component";
import { WebhooksComponent } from "./webhooks/webhooks.component";

export const adminRoutes: Routes = [
  { path: '', redirectTo: 'usermanagement'},
  { path: 'usermanagement', component: UserManagementComponent },
  { path: 'webhooks', component: WebhooksComponent },
  { path: 'mail', component: MailComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    RouterModule.forChild(adminRoutes),
  ],
  declarations: [
    UserManagementComponent,
    WebhooksComponent,
    MailComponent
  ],
  exports: [
    RouterModule
  ]
})
export class AdminRoutingModule {}