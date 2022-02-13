import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminService } from './services/admin.service';
import { DiaryService } from './services/diary.service';
import { DishService } from './services/dish.service';
import { FoodService } from './services/food.service';
import { GoogleService } from './services/google.service';
import { ScrollBehaviourService } from './services/scroll-behaviour.service';
import { ToastService } from './services/toast.service';
import { UserService } from './services/user.service';
import { WebhookService } from './services/webhook.service';
import { WeightService } from './services/weight.service';

@NgModule({
  imports: [
    CommonModule
  ], 
  providers: [
    AdminService,
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
