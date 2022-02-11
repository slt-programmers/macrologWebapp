import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { ComponentsModule } from "src/app/shared/components/components.module";
import { AdminComponent } from "./admin/admin.component";
import { AuthenticatedRoutingModule } from "./authenticated-routing.module";
import { AuthenticatedComponent } from "./authenticated.component";
import { DiaryPageComponent } from "./diary/diary-page/diary-page.component";
import { DiaryComponent } from "./diary/diary.component";
import { LogActivityComponent } from "./diary/log-activity/log-activity.component";
import { LogMealComponent } from "./diary/log-meal/log-meal.component";
import { DishesComponent } from "./dishes/dishes.component";
import { EditFoodComponent } from "./food/edit-food/edit-food.component";
import { FoodComponent } from "./food/food.component";
import { GraphsComponent } from "./graphs/graphs.component";
import { OnboardingComponent } from "./onboarding/onboarding.component";
import { UserComponent } from "./user/user.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ComponentsModule,
    AuthenticatedRoutingModule,
  ],
  declarations: [
    AuthenticatedComponent,
    DiaryComponent,
    UserComponent,
    AdminComponent,
    OnboardingComponent,
    FoodComponent,
    EditFoodComponent,
    DishesComponent,
    GraphsComponent,
    LogMealComponent,
    LogActivityComponent,
    DiaryPageComponent
  ],
  exports: [
  ]
})
export class AuthenticatedModule { }
