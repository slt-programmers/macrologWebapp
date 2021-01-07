import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuthenticatedRoutingModule } from './authenticated-routing.module';

@NgModule({
  imports: [
    CommonModule,
    AuthenticatedRoutingModule,
  ]
})
export class AuthenticatedModule {}
