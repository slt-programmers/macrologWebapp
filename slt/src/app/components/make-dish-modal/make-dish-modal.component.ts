import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Dish } from '../../model/dish';
import { Ingredient } from '../../model/ingredient';
import { FoodSearchable } from '../../model/foodSearchable';
import { FoodService } from '../../services/food.service';
import { MealService } from '../../services/meal.service';
import { Food } from '@app/model/food';

@Component({
	selector: 'make-dish-modal',
	templateUrl: './make-dish-modal.component.html'
})
export class MakeDishModalComponent implements OnInit {

	@Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

	public modalTitle = 'Make a dish';
	public dishName = '';
	public food: Food[];
	public searchables: FoodSearchable[] = new Array();
	public addIngredientCallBack: Function;
	public ingredients: Ingredient[] = new Array();

	private unitName = 'gram';
	private unitGrams = 100.00;

	constructor(private foodService: FoodService,
		private mealService: MealService) {
	}

	ngOnInit() {
		this.getAllFood();
		this.addIngredientCallBack = this.addIngredient.bind(this);
	}

	private getAllFood() {
		this.foodService.getAllFood().subscribe(
			data => {
				this.food = data;
				this.getFoodSearchableList();
			},
			error => console.log(error)
		);
	}

	private getFoodSearchableList() {
		const foodList = new Array();
		for (const item of this.food) {
			const searchable = new FoodSearchable(item);
			foodList.push(searchable);
		}
		this.searchables = foodList;
	}

	public getAvailablePortions(ingredient: Ingredient) {
		for (const item of this.searchables) {
			if (item.food.id === ingredient.food.id) {
				return item.food.portions;
			}
		}
		return undefined;
	}

	public portionChange(ingredient: Ingredient, eventTarget: any) {
		if (eventTarget.value === this.unitName) {
			ingredient.portion = undefined;
		} else {
			for (const portion of ingredient.food.portions) {
				if (portion.description === eventTarget.value) {
					ingredient.portion = portion;
					break;
				}
			}
		}
		ingredient.multiplier = 1;
	}

	private addIngredient(foodSearchable: FoodSearchable) {
		const ingredient = new Ingredient();
		ingredient.food = foodSearchable.food;
		this.ingredients.push(ingredient);
	}

	public removeIngredient(index: number) {
		this.ingredients.splice(index, 1);
	}

	public calculateMultiplier(event: any, ingredient: Ingredient) {
		if (ingredient.portion === undefined) {
			ingredient.multiplier = (event.target.value / this.unitGrams);
			console.log(ingredient.multiplier);
		} else {
			ingredient.multiplier = event.target.value;
			console.log(ingredient.multiplier);
		}
	}

	public getValue(ingredient: Ingredient) {
		if (ingredient.portion === undefined) {
			return Math.round(this.unitGrams * ingredient.multiplier);
		} else {
			return ingredient.multiplier;
		}
	}

	public getStep(ingredient: Ingredient) {
		if (ingredient.portion === undefined) {
			return 1;
		} else {
			return 0.1;
		}
	}

	public saveDish() {
		const dish = new Dish(this.dishName);
		dish.ingredients = this.ingredients;
		const self = this;
		const closeCallBack = () => {
			self.closeModal();
		};
		this.mealService.insertMeal(dish, closeCallBack);
	}

	public closeModal() {
		this.close.emit(true);
	}

}
