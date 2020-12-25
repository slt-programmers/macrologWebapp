import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthenticatedRoutingModule } from './authenticated-routing.module';
import { AdminComponent } from './admin/admin.component';
import { DiaryComponent } from './diary/diary.component';
import { FoodComponent } from './food/food.component';
import { UserManagementComponent } from './admin/usermanagement/usermanagement.component';
import { WebhooksComponent } from './admin/webhooks/webhooks.component';
import { MailComponent } from './admin/mail/mail.component';
import { DishesComponent } from './dishes/dishes.component';
import { GraphsComponent } from './analytics/analytics.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { AuthenticatedComponent } from './authenticated.component';
import { UserModule } from './user/user.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AuthenticatedRoutingModule,
    SharedModule,
    UserModule,
  ],
  declarations: [
    AuthenticatedComponent,
    AdminComponent,
    DiaryComponent,
    FoodComponent,
    UserManagementComponent,
    WebhooksComponent,
    MailComponent,
    DishesComponent,
    GraphsComponent,
    OnboardingComponent,
  ],
})
export class AuthenticatedModule {}
