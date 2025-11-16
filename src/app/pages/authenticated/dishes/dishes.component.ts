import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { Portion } from "src/app/shared/model/portion";
import { dishesActions } from "src/app/shared/store/actions/dishes.actions";
import { selectAllDishes } from "src/app/shared/store/selectors/dishes.selectors";
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
export class DishesComponent implements OnInit, OnDestroy {
	private readonly store = inject(Store);

	allDishes: Dish[] = [];
	selectedDish?: Dish;
	modalIsVisible = false;

	private subscription?: Subscription;

	ngOnInit() {
		this.store.dispatch(dishesActions.get());
		this.subscription = this.store.select(selectAllDishes).subscribe((it) => {
			this.allDishes = it;
		});
	}

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

	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
}
