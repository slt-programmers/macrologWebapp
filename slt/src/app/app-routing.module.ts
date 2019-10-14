import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './pages/guest/home/home.component';
import { AboutComponent } from './pages/guest/about/about.component';
import { LoginComponent } from './pages/guest/login/login.component';
import { AuthenticatedComponent } from './pages/authenticated/authenticated.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'about', component: AboutComponent },
  { path: 'login', component: LoginComponent },
  { path: '*', component: AuthenticatedComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
