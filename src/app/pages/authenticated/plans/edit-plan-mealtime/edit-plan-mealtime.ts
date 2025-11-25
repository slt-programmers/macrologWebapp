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
	}

	selectItem(foodOrDish: FoodSearchable): void {
		if (foodOrDish.food) {
			const food = foodOrDish.food;
			const portion = food.portions[0];
			this.mealtime.items.push({
				food,
				portion: portion,
				multiplier: 1,
			});
		} else if (foodOrDish.dish) {
			this.mealtime.items.push(...foodOrDish.dish.ingredients);
		}
	}

	changeMultiplier(multiplier: number, index: number): void {
		if (!this.mealtime.items[index].portion) {
			this.mealtime.items[index].multiplier = multiplier / 100;
		} else {
			this.mealtime.items[index].multiplier = multiplier;
		}
	}

	removeItem(index: number): void {
		this.mealtime.items.splice(index, 1);
	}

	save(): void {
		const planId = +this.route.snapshot.params["planId"];
		this.planStore.saveMealtime({ planId, mealtime: this.mealtime });
	}
}
