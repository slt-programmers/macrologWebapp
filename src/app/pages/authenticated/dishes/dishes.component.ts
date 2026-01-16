import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { DishStore } from "src/app/shared/store/dish.store";
import { clone } from "src/app/util/functions";
import { PiechartComponent } from "../../../shared/components/piechart/piechart.component";
import { Dish } from "../../../shared/model/dish";
import { Ingredient } from "../../../shared/model/ingredient";
import { EditDishComponent } from "./edit-dish/edit-dish.component";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";

@Component({
	selector: "ml-dishes",
	templateUrl: "./dishes.component.html",
	imports: [PiechartComponent, EditDishComponent, FormsModule, FontAwesomeModule],
})
export class DishesComponent {
  faPlus = faPlus
	private readonly dishStore = inject(DishStore);

	allDishes = this.dishStore.dishes;
	selectedDish?: Dish;
	modalIsVisible = false;

	openModal(dish: Dish | null): void {
		if (dish) {
			this.selectedDish = {
				...dish,
				ingredients: clone(dish.ingredients) || [],
			};
		} else {
			this.selectedDish = {
				name: "",
				ingredients: [],
				macrosCalculated: { 
					protein: 0, fat: 0, carbs: 0, calories: 0
				}
			};
		}
		this.modalIsVisible = true;
	}

	closeModal(): void {
		this.modalIsVisible = false;
		this.selectedDish = undefined;
	}

	getIngredientDescription(ingredient: Ingredient): string {
		if (ingredient.portion) {
			return ingredient.multiplier + " " + ingredient.portion.description;
		} else {
			return ingredient.multiplier! * 100 + " gram";
		}
	}

}
