import { NgModule } from "@angular/core";
import { MatFormFieldModule } from "@angular/material/form-field";
import { MatInputModule } from "@angular/material/input";
import { MatRadioModule } from "@angular/material/radio";

@NgModule({
  imports: [
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
  ], 
  exports: [
    MatInputModule,
    MatFormFieldModule,
    MatRadioModule,
  ]
})
export class MaterialModule { }