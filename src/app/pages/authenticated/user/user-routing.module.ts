import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterModule, Routes } from "@angular/router";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { LinegraphComponent } from "src/app/shared/components/linegraph/linegraph.component";
import { CalculateIntakeModalComponent } from "src/app/shared/components/modals/calculate-intake-modal/calculate-intake-modal.component";
import { AccountComponent } from "./account/account.component";
import { ConnectivityComponent } from "./connectivity/connectivity.component";
import { IntakeComponent } from "./intake/intake.component";
import { PersonalComponent } from "./personal/personal.component";
import { WeightTrackerComponent } from "./weighttracker/weighttracker.component";

export const userRoutes: Routes = [
  { path: '', redirectTo: 'personal' },
  { path: 'personal', component: PersonalComponent },
  { path: 'foodintake', component: IntakeComponent },
  { path: 'weighttracker', component: WeightTrackerComponent },
  { path: 'connectivity', component: ConnectivityComponent },
  { path: 'account', component: AccountComponent },
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    RouterModule.forChild(userRoutes),
  ],
  exports: [
    RouterModule,
  ],
  declarations: [
    LinegraphComponent,
    CalculateIntakeModalComponent,

    PersonalComponent,
    IntakeComponent,
    WeightTrackerComponent,
    ConnectivityComponent,
    AccountComponent
  ]
})
export class UserRoutingModule { }