import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from './auth.guard';
import { AuthenticatedComponent } from './authenticated.component';
import { DiaryComponent } from './diary/diary.component';
import { DishesComponent } from './dishes/dishes.component';
import { FoodComponent } from './food/food.component';
import { GraphsComponent } from './graphs/graphs.component';
import { OnboardingComponent } from './onboarding/onboarding.component';
import { UserComponent } from './user/user.component';


export const authenticatedRoutes: Routes = [
  {
    path: '',
    component: AuthenticatedComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: DiaryComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'user',
        component: UserComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'admin',
        component: AdminComponent,
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule)
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
export class AuthenticatedRoutingModule { }
