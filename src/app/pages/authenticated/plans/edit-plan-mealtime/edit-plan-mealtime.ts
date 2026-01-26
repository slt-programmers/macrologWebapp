import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { ActivatedRoute, Router, RouterLink } from "@angular/router";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import {
	faChevronLeft,
	faPlus,
	faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { AutocompleteFoodComponent } from "src/app/shared/components/autocomplete-food/autocomplete-food.component";
import { FoodSearchable } from "src/app/shared/model/foodSearchable";
import { Ingredient } from "src/app/shared/model/ingredient";
import { Mealtime } from "src/app/shared/model/mealtime";
import { PlanStore } from "src/app/shared/store/plan.store";

@Component({
	selector: "ml-edit-plan-mealtime",
	imports: [
		RouterLink,
		FontAwesomeModule,
		AutocompleteFoodComponent,
		FormsModule,
	],
	templateUrl: "./edit-plan-mealtime.html",
	styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  `,
})
export class EditPlanMealtime {
	faChevronLeft = faChevronLeft;
	faPlus = faPlus;
	faTrash = faTrash;

	private readonly router = inject(Router);
	private readonly route = inject(ActivatedRoute);
	private readonly planStore = inject(PlanStore);
	mealtime: Mealtime;

	constructor() {
		const mealtime = this.planStore.mealtimeToEdit;
		if (!mealtime || !mealtime()) {
			this.router.navigate(["dashboard", "plans"]);
		}
		this.mealtime = mealtime!()!;
		console.log("Edit constructor: " + JSON.stringify(this.mealtime))
	}

	selectItem(foodOrDish: FoodSearchable): void {
		if (foodOrDish.food) {
			const food = foodOrDish.food;
			const portion = food.portions[0];
			console.log("Select item (food): " + JSON.stringify(portion))
			this.mealtime.ingredients.push({
				food,
				portion: portion,
				multiplier: 1,
			} as Ingredient);
		} else if (foodOrDish.dish) {
			for (const ingredient of foodOrDish.dish.ingredients) {
				console.log("Select item (food): " + JSON.stringify(ingredient.portion))
				this.mealtime.ingredients.push({
					food: ingredient.food,
					portion: ingredient.portion,
					multiplier: ingredient.multiplier,
				} as Ingredient);
			}
		}
	}

	changeMultiplier(multiplier: number, index: number): void {
		if (!this.mealtime.ingredients[index].portion) {
			this.mealtime.ingredients[index].multiplier = multiplier / 100;
		} else {
			this.mealtime.ingredients[index].multiplier = multiplier;
		}
	}

	removeItem(index: number): void {
		this.mealtime.ingredients.splice(index, 1);
	}

	save(): void {
		const planId = +this.route.snapshot.params["planId"];
		console.log("Edit save mealtime: " + JSON.stringify(this.mealtime))
		this.planStore.saveMealtime({ planId, mealtime: this.mealtime });
	}
}
