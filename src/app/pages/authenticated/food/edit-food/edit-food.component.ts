import { Component, OnInit, inject, input, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faMinus, faPlus } from "@fortawesome/free-solid-svg-icons";
import { Food } from "src/app/shared/model/food";
import { Portion } from "src/app/shared/model/portion";
import { FoodStore } from "src/app/shared/store/food.store";
import { ModalComponent } from "../../../../shared/components/modal/modal.component";

@Component({
  selector: "ml-edit-food",
  templateUrl: "./edit-food.component.html",
  styleUrl: "./edit-food.component.css",
  imports: [ModalComponent, FormsModule, FontAwesomeModule],
})
export class EditFoodComponent implements OnInit {
  faMinus = faMinus;
  faPlus = faPlus
  private readonly foodStore = inject(FoodStore);

  readonly selectedFood = input.required<Food>();
  readonly close$ = output<boolean>();

  title = "Add food";

  ngOnInit(): void {
    if (this.selectedFood().id) {
      this.title = "Edit food";
    }
  }

  saveFood(): void {
    const newFood: Food = {
      name: this.selectedFood().name,
      protein: this.selectedFood().protein,
      fat: this.selectedFood().fat,
      carbs: this.selectedFood().carbs,
      portions: this.selectedFood().portions
    };

    const selectedFood = this.selectedFood();
    if (selectedFood) {
      newFood.id = selectedFood.id;
    }
    newFood.portions = selectedFood.portions;
    this.foodStore.postFood(newFood);
    this.close$.emit(true);
  }

  public removePortion(index: number): void {
    this.selectedFood().portions!.splice(index, 1);
  }

  public isNewPortion(portion: Portion): boolean {
    if (portion.id) {
      return false;
    }
    return true;
  }

  public addNewPortion(): void {
    this.selectedFood().portions!.push({} as Portion);
  }
}
