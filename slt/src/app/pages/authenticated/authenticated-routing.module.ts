import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthenticatedComponent } from './authenticated.component';
import { DiaryComponent } from './diary/diary.component';
import { AdminComponent } from './admin/admin.component';
import { UserManagementComponent } from './admin/usermanagement/usermanagement.component';
import { WebhooksComponent } from './admin/webhooks/webhooks.component';
import { MailComponent } from './admin/mail/mail.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { FoodComponent } from './food/food.component';
import { DishesComponent } from './dishes/dishes.component';
import { GraphsComponent } from './analytics/analytics.component';
import { AuthGuard } from 'src/app/services/auth.guard';
import { UserComponent } from './user/user.component';

export const authenticatedRoutes: Routes = [
  {
    path: '',
    component: AuthenticatedComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'log',
        component: DiaryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'user',
        component: UserComponent,
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule),
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
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
        canActivate: [AuthGuard],
      },
      {
        path: 'food',
        component: FoodComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'dishes',
        component: DishesComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'graphs',
        component: GraphsComponent,
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(authenticatedRoutes)],
  providers: [AuthGuard],
  exports: [RouterModule],
})
export class AuthenticatedRoutingModule {}
