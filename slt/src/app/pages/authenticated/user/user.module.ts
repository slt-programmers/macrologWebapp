import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';

import { UserComponent } from './user.component';
import { IntakeComponent } from './intake/intake.component';
import { PersonalComponent } from './personal/personal.component';
import { AccountComponent } from './account/account.component';
import { WeightTrackerComponent } from './weighttracker/weighttracker.component';
import { ConnectivityComponent } from './connectivity/connectivity.component';

import { SharedModule } from 'src/app/shared/shared.module';

export const userRoutes: Routes = [
  { path: '', redirectTo: 'personal', pathMatch: 'full' },
  { path: 'personal', component: PersonalComponent },
  { path: 'foodintake', component: IntakeComponent },
  { path: 'weighttracker', component: WeightTrackerComponent },
  { path: 'connectivity', component: ConnectivityComponent },
  { path: 'account', component: AccountComponent },
];

@NgModule({
  declarations: [
    UserComponent,
    IntakeComponent,
    PersonalComponent,
    AccountComponent,
    WeightTrackerComponent,
    ConnectivityComponent,
  ],
  imports: [CommonModule, SharedModule, RouterModule.forChild(userRoutes)],
})
export class UserModule {}
