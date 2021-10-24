import { NgModule } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";

@NgModule({
  imports: [
    MatInputModule,
    MatFormFieldModule,
  ], 
  exports: [
    MatInputModule,
    MatFormFieldModule,
  ]
})
export class MaterialModule { }