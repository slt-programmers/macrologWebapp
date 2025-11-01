import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AdminRoutingModule } from "./admin-routing.module";
import { MailComponent } from "./mail/mail.component";
import { UserManagementComponent } from "./usermanagement/usermanagement.component";
import { WebhooksComponent } from "./webhooks/webhooks.component";

@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AdminRoutingModule,
    UserManagementComponent,
    WebhooksComponent,
    MailComponent
]
})
export class AdminModule { }
