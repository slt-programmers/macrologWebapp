import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticatedComponent } from './authenticated.component';
import { DiaryComponent } from './diary/diary.component';
import { UserComponent } from './user/user.component';
import { PersonalComponent } from './user/personal/personal.component';
import { IntakeComponent } from './user/intake/intake.component';
import { WeightTrackerComponent } from './user/weighttracker/weighttracker.component';
import { ConnectivityComponent } from './user/connectivity/connectivity.component';
import { AccountComponent } from './user/account/account.component';
import { AdminComponent } from './admin/admin.component';
import { UserManagementComponent } from './admin/usermanagement/usermanagement.component';
import { WebhooksComponent } from './admin/webhooks/webhooks.component';
import { MailComponent } from './admin/mail/mail.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { FoodComponent } from './food/food.component';
import { DishesComponent } from './dishes/dishes.component';
import { GraphsComponent } from './analytics/analytics.component';
import { AuthGuardService } from 'src/app/services/auth-guard.service';

export const authenticatedRoutes: Routes = [
  {
    path: '',
    component: AuthenticatedComponent,
    canActivate: [AuthGuardService],
    children: [
      {
        path: 'log',
        component: DiaryComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'user',
        component: UserComponent,
        canActivate: [AuthGuardService],
        children: [
          { path: '', redirectTo: 'personal', pathMatch: 'full' },
          { path: 'personal', component: PersonalComponent },
          { path: 'foodintake', component: IntakeComponent },
          { path: 'weighttracker', component: WeightTrackerComponent },
          { path: 'connectivity', component: ConnectivityComponent },
          { path: 'account', component: AccountComponent },
        ],
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuardService],
        children: [
          { path: '', redirectTo: 'usermanagement', pathMatch: 'full' },
          { path: 'usermanagement', component: UserManagementComponent },
          { path: 'webhooks', component: WebhooksComponent },
          { path: 'mail', component: MailComponent },
        ],
      },
      {
        path: 'onboarding',
        component: OnboardingComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'food',
        component: FoodComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'dishes',
        component: DishesComponent,
        canActivate: [AuthGuardService],
      },
      {
        path: 'graphs',
        component: GraphsComponent,
        canActivate: [AuthGuardService],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(authenticatedRoutes)],
  exports: [RouterModule],
})
export class AuthenticatedRoutingModule {}
