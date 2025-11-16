import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { Food } from "src/app/shared/model/food";
import { FoodSearchable } from "src/app/shared/model/foodSearchable";
import { Portion } from "src/app/shared/model/portion";
import { dishesActions } from "src/app/shared/store/actions/dishes.actions";
import { selectAllDishes } from "src/app/shared/store/selectors/dishes.selectors";
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

	public allDishes: Dish[] = [];
	public selectedDish?: Dish;
	public modalIsVisible = false;

	public dishName = "";
	public ingredients: Ingredient[] = [];

	public food: Food[] = [];
	public searchables: FoodSearchable[] = [];
	public unitName = "grams";

	private subscription?: Subscription;

	ngOnInit() {
		this.store.dispatch(dishesActions.get());
		this.subscription = this.store.select(selectAllDishes).subscribe((it) => {
			this.allDishes = it;
		});
	}

	public openModal(dish: Dish | null): void {
		if (dish) {
			const ingredients = [];
			for (const ingredient of dish.ingredients) {
				ingredients.push({
					...ingredient,
					portion: ingredient.portion
						? this.getPortion(ingredient, ingredient.portion.id!)
						: {},
				});
			}
			this.selectedDish = { ...dish, ingredients: ingredients };
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

	public getPortion(ingredient: Ingredient, portionId: number): Portion {
		for (const portion of ingredient.food.portions!) {
			if (portion.id === portionId) {
				return portion;
			}
		}
		return {} as Portion;
	}

	public getIngredientDescription(ingredient: Ingredient): string {
		if (ingredient.portion) {
			const usedPortion = this.getPortion(ingredient, ingredient.portion.id!);
			return ingredient.multiplier + " " + usedPortion.description;
		} else {
			return ingredient.multiplier! * 100 + " gram";
		}
	}

	public getTotal(dish: Dish) {
		return dish.macrosCalculated;
	}


	ngOnDestroy(): void {
		if (this.subscription) {
			this.subscription.unsubscribe();
		}
	}
}
