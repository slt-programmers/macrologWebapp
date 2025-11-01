import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Store } from "@ngrx/store";
import { Food } from "src/app/shared/model/food";
import { Portion } from "src/app/shared/model/portion";
import { foodActions } from "src/app/shared/store/actions/food.actions";
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { FormsModule } from "@angular/forms";


@Component({
    selector: 'ml-edit-food',
    templateUrl: './edit-food.component.html',
    imports: [ModalComponent, FormsModule]
})
export class EditFoodComponent implements OnInit {

  @Input() selectedFood: Food;
  @Output() close$ = new EventEmitter<boolean>();

  public title = 'Add food';

  constructor(private readonly store: Store) { }

  ngOnInit() {
    if (!!this.selectedFood.id) {
      this.title = 'Edit food';
    }
  }

  public saveFood(): void {
    const newFood: Food = {
      name: this.selectedFood.name,
      protein: this.selectedFood.protein,
      fat: this.selectedFood.fat,
      carbs: this.selectedFood.carbs
    };

    if (this.selectedFood) {
      newFood.id = this.selectedFood.id;
    }
    newFood.portions = this.selectedFood.portions;
    this.store.dispatch(foodActions.post(newFood));
    this.close$.emit(true);
  }

  public removePortion(index: number): void {
    this.selectedFood.portions.splice(index, 1);
  }

  public isNewPortion(portion: Portion): boolean {
    if (!!portion.id) {
      return false;
    }
    return true;
  }

  public addNewPortion(): void {
    this.selectedFood.portions.push({});
  }


}