import { NgClass } from "@angular/common";
import {
	Component,
	effect,
	inject,
	input,
	output
} from "@angular/core";
import { FormsModule } from "@angular/forms";
import { FoodSearchable } from "../../model/foodSearchable";
import { DishStore } from "../../store/dish.store";
import { FoodStore } from "../../store/food.store";

@Component({
	selector: "ml-autocomplete-food",
	templateUrl: "./autocomplete-food.component.html",
	styleUrls: ["./autocomplete-food.component.css"],
	imports: [FormsModule, NgClass],
})
export class AutocompleteFoodComponent {
	private readonly dishStore = inject(DishStore);
	private readonly foodStore = inject(FoodStore);

	readonly placeholder = input("");
	readonly includeDishes = input(false);
	readonly selected = output<FoodSearchable>();

	public searchables: FoodSearchable[] = [];
	public foodMatch: FoodSearchable[] = [];
	public foodName = "";
	public showAutoComplete = false;

	public allFood = this.foodStore.food;
	public allDishes = this.dishStore.dishes;

	constructor() {
		effect(() => {
			if (this.allDishes() && this.allFood()) {
				this.getFoodSearchableList();
			}
		});
	}

	public findFoodMatch(event: Event) {
		this.foodMatch = [];
		if ((event as InputEvent).data !== null) {
			for (const item of this.searchables) {
				let matchFoodName = false;
				let matchDishName = false;
				if (item.food) {
					matchFoodName =
						item.food.name.toLowerCase().indexOf(this.foodName.toLowerCase()) >=
						0;
				} else if (item.dish) {
					matchDishName =	item.dish.name.toLowerCase().indexOf(this.foodName.toLowerCase()) >= 0;
				}
				if (matchFoodName || matchDishName) {
					this.foodMatch.push(item);
				}
			}
		}
	}

	public selectMatch(match: FoodSearchable) {
		this.foodName = "";
		this.showAutoComplete = false;
		this.selected.emit(match);
	}

	public getDescription(foodSearchable: FoodSearchable): string {
		if (foodSearchable.dish) {
			return foodSearchable.dish.name + " (dish)";
		}
		return foodSearchable.food?.name ?? "";
	}

	private getFoodSearchableList(): void {
		const searchList: FoodSearchable[] = [];
		for (const item of this.allFood()) {
			const searchable: FoodSearchable = { food: item };
			searchList.push(searchable);
		}
		if (this.includeDishes()) {
			for (const dish of this.allDishes()) {
				searchList.push({ dish: dish });
			}
		}
		this.searchables = searchList;
	}
}
