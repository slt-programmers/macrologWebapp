import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthenticatedRoutingModule } from './authenticated-routing.module';
import { EditFoodComponent } from './food/edit-food/edit-food.component';

@NgModule({
  imports: [
    CommonModule,
    AuthenticatedRoutingModule,
  ],
  declarations: [
    // EditFoodComponent
  ]
})
export class AuthenticatedModule {}
