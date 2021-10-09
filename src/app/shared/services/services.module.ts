import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivityService } from './activity.service';
import { AdminService } from './admin.service';
import { DiaryService } from './diary.service';
import { DishService } from './dish.service';
import { FoodService } from './food.service';
import { GoogleService } from './google.service';
import { ScrollBehaviourService } from './scroll-behaviour.service';
import { ToastService } from './toast.service';
import { UserService } from './user.service';
import { WebhookService } from './webhook.service';
import { WeightService } from './weight.service';

@NgModule({
  imports: [
    CommonModule
  ], 
  providers: [
    AdminService,
    ActivityService,
    FoodService,
    DiaryService,
    UserService,
    ToastService,
    DishService,
    WeightService,
    ScrollBehaviourService,
    WebhookService,
    GoogleService,
  ]
})
export class ServicesModule { }
