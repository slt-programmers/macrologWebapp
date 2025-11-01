import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AdminComponent } from "./admin/admin.component";
import { AuthenticatedRoutingModule } from "./authenticated-routing.module";
import { AuthenticatedComponent } from "./authenticated.component";
import { DiaryPageComponent } from "./diary/diary-page/diary-page.component";
import { DiaryComponent } from "./diary/diary.component";
import { DishesComponent } from "./dishes/dishes.component";
import { EditFoodComponent } from "./food/edit-food/edit-food.component";
import { FoodComponent } from "./food/food.component";
import { GraphsComponent } from "./graphs/graphs.component";
import { OnboardingComponent } from "./onboarding/onboarding.component";
import { UserComponent } from "./user/user.component";
import { EntryPageRowComponent } from './diary/entry-page-row/entry-page-row.component';
import { ActivityPageRowComponent } from './diary/activity-page-row/activity-page-row.component';

@NgModule({
    imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthenticatedRoutingModule,
    AuthenticatedComponent,
    DiaryComponent,
    UserComponent,
    AdminComponent,
    OnboardingComponent,
    FoodComponent,
    EditFoodComponent,
    DishesComponent,
    GraphsComponent,
    DiaryPageComponent,
    EntryPageRowComponent,
    ActivityPageRowComponent,
],
    exports: []
})
export class AuthenticatedModule { }
