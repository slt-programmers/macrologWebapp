import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
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
  imports: [RouterModule.forChild(userRoutes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }