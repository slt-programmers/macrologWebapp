import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';

export const authenticatedRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./authenticated.component').then(m => m.AuthenticatedComponent),
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./diary/diary.component').then(m => m.DiaryComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'user',
        loadComponent: () => import('./user/user.component').then(m => m.UserComponent),
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./user/user.module').then((m) => m.UserModule)
      },
      {
        path: 'admin',
        loadComponent: () => import('./admin/admin.component').then(m => m.AdminComponent),
        canActivate: [AuthGuard],
        loadChildren: () =>
          import('./admin/admin.module').then((m) => m.AdminModule)
      },
      {
        path: 'onboarding',
        loadComponent: () => import('./onboarding/onboarding.component').then(m => m.OnboardingComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'food',
        loadComponent: () => import('./food/food.component').then(m => m.FoodComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'dishes',
        loadComponent: () => import('./dishes/dishes.component').then(m => m.DishesComponent),
        canActivate: [AuthGuard],
      },
      {
        path: 'plans',
        loadComponent: () => import('./plans/plans').then(m => m.Plans),
        canActivate: [AuthGuard],
      },
            {
        path: 'plans/:id',
        loadComponent: () => import('./plans/plan/plan').then(m => m.Plan),
        canActivate: [AuthGuard],
      },
      {
        path: 'graphs',
        loadComponent: () => import('./graphs/graphs.component').then(m => m.GraphsComponent),
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
