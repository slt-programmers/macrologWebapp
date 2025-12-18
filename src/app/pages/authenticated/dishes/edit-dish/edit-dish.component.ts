import { Component, inject, input, OnInit, output } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { AutocompleteFoodComponent } from "src/app/shared/components/autocomplete-food/autocomplete-food.component";
import { ModalComponent } from "src/app/shared/components/modal/modal.component";
import { Dish } from "src/app/shared/model/dish";
import { FoodSearchable } from "src/app/shared/model/foodSearchable";
import { Ingredient } from "src/app/shared/model/ingredient";
import { DishStore } from "src/app/shared/store/dish.store";

@Component({
	selector: "ml-edit-dish",
	imports: [ModalComponent, AutocompleteFoodComponent, FormsModule, FontAwesomeModule],
	templateUrl: "./edit-dish.component.html",
	styleUrl: "./edit-dish.component.css",
})
export class EditDishComponent implements OnInit {
  faTrash = faTrash
	private readonly dishStore = inject(DishStore);
	
	readonly selectedDish = input.required<Dish>();
	readonly close$ = output<boolean>();

	private unitGrams = 100.0;

	readonly unitName = "grams";

	title = "Add a dish";

	ngOnInit(): void {
		if (this.selectedDish().id) {
			this.title = "Edit dish";
		}
	}

	portionChange(ingredient: Ingredient, eventTarget: any) {
		if (eventTarget.value === this.unitName) {
			ingredient.portion = undefined;
		} else {
			for (const portion of ingredient.food.portions!) {
				if (portion.description === eventTarget.value) {
					ingredient.portion = portion;
					break;
				}
			}
		}
		ingredient.multiplier = 1;
	}

	getValue(ingredient: Ingredient): number {
		if (ingredient.portion === undefined) {
			return Math.round(this.unitGrams * ingredient.multiplier!);
		} else {
			return ingredient.multiplier!;
		}
	}

	calculateMultiplier(event: any, ingredient: Ingredient): void {
		if (ingredient.portion === undefined) {
			ingredient.multiplier = event.target.value / this.unitGrams;
		} else {
			ingredient.multiplier = event.target.value;
		}
	}

	getStep(ingredient: Ingredient): number {
		if (ingredient.portion === undefined) {
			return 1;
		} else {
			return 0.1;
		}
	}

	removeIngredient(index: number): void {
		this.selectedDish().ingredients.splice(index, 1);
	}

	addIngredient(foodSearchable: FoodSearchable) {
		const ingredient = {
			multiplier: 1,
			food: foodSearchable.food!,
		} as Ingredient;
		this.selectedDish().ingredients.push(ingredient);
	}

	saveDish(): void {
		this.dishStore.postDish(this.selectedDish());
		this.close$.emit(false);
	}

	deleteDish(): void {
		this.dishStore.deleteDish(this.selectedDish().id!);
		this.close$.emit(false);
	}
}
