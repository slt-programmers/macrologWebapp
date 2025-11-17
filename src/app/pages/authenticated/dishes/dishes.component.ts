import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Portion } from "src/app/shared/model/portion";
import { DishStore } from "src/app/shared/store/dish.store";
import { clone } from "src/app/util/functions";
import { PiechartComponent } from "../../../shared/components/piechart/piechart.component";
import { Dish } from "../../../shared/model/dish";
import { Ingredient } from "../../../shared/model/ingredient";
import { EditDishComponent } from "./edit-dish/edit-dish.component";

@Component({
	selector: "ml-dishes",
	templateUrl: "./dishes.component.html",
	imports: [PiechartComponent, EditDishComponent, FormsModule],
})
export class DishesComponent {
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
			};
		}
		this.modalIsVisible = true;
	}

	closeModal(): void {
		this.modalIsVisible = false;
		this.selectedDish = undefined;
	}

	getTotal(dish: Dish) {
		return dish.macrosCalculated;
	}

	getIngredientDescription(ingredient: Ingredient): string {
		if (ingredient.portion) {
			const usedPortion = this.getPortion(ingredient, ingredient.portion.id!);
			return ingredient.multiplier + " " + usedPortion.description;
		} else {
			return ingredient.multiplier! * 100 + " gram";
		}
	}

	private getPortion(ingredient: Ingredient, portionId: number): Portion {
		for (const portion of ingredient.food.portions!) {
			if (portion.id === portionId) {
				return portion;
			}
		}
		return {} as Portion;
	}
}
