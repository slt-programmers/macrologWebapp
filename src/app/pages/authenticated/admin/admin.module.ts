import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { AdminRoutingModule } from "./admin-routing.module";
import { MailComponent } from "./mail/mail.component";
import { UserManagementComponent } from "./usermanagement/usermanagement.component";
import { WebhooksComponent } from "./webhooks/webhooks.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule, 
    AdminRoutingModule
  ],
  declarations: [
    UserManagementComponent,
    WebhooksComponent,
    MailComponent
  ]
})
export class AdminModule { }
