import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserRoutingModule } from './user-routing.module';
import { AccountComponent } from './account/account.component';
import { ConnectivityComponent } from './connectivity/connectivity.component';
import { IntakeComponent } from './intake/intake.component';
import { PersonalComponent } from './personal/personal.component';
import { WeightTrackerComponent } from './weighttracker/weighttracker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UserComponent } from './user.component';

@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    UserRoutingModule,
    PersonalComponent,
    IntakeComponent,
    WeightTrackerComponent,
    ConnectivityComponent,
    AccountComponent,
]
})
export class UserModule { }
