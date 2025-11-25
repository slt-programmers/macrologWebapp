import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from './services/admin.service';
import { EntryService } from './services/entry.service';
import { GoogleService } from './services/google.service';
import { ScrollBehaviourService } from './services/scroll-behaviour.service';
import { ToastService } from './services/toast.service';
import { UserService } from './services/user.service';
import { WebhookService } from './services/webhook.service';
import { WeightService } from './services/weight.service';
import { ActivityService } from './services/activity.service';
import { DishService } from './services/dish.service';
import { FoodService } from './services/food.service';
import { PlanService } from './services/plan.service';

@NgModule({
  imports: [
    CommonModule
  ], 
  providers: [
    ActivityService,
    AdminService,
    DishService,
    EntryService,
    FoodService,
    UserService,
    ToastService,
    WeightService,
    ScrollBehaviourService,
    WebhookService,
    GoogleService,
    PlanService
  ]
})
export class ServicesModule { }
