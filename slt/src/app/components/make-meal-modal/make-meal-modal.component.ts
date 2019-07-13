import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Meal } from '../../model/meal';
import { Ingredient } from '../../model/ingredient';
import { FoodSearchable } from '../../model/foodSearchable';
import { FoodService } from '../../services/food.service';
import { MealService } from '../../services/meal.service';

@Component({
	selector: 'make-meal-modal',
	templateUrl: './make-meal-modal.component.html'
})
export class MakeMealModalComponent implements OnInit {

	@Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

	private modalTitle = 'Make a meal';
	private mealName = '';
	private food;
	private foodAndPortions = new Array();
	private addIngredientCallBack: Function;
	private ingredients: Ingredient[] = new Array();
	private unitName = 'gram';
	private unitGrams = 100.00;

	constructor(private foodService: FoodService,
		private mealService: MealService) {
	}

	ngOnInit() {
		this.getAllFood();
		this.addIngredientCallBack = this.addIngredient.bind(this);
	}

	addIngredient(foodSearchable: FoodSearchable) {
		const ingredient = new Ingredient();
		ingredient.food = foodSearchable.food;
		ingredient.foodId = ingredient.food.id;
		ingredient.portion = foodSearchable.portion;
		if (ingredient.portion !== undefined) {
			ingredient.portionId = ingredient.portion.id;
		}
		this.ingredients.push(ingredient);
		console.log(this.ingredients);
	}

	removeIngredient(index) {
		this.ingredients.splice(index, 1);
		console.log(this.ingredients);
	}

	calculateMultiplier(event, ingredient) {
		console.log(event.target.value);
		if (ingredient.portion === undefined) {
			ingredient.multiplier = (event.target.value / this.unitGrams);
			console.log(ingredient.multiplier);
			console.log(this.ingredients);
		} else {
			ingredient.multiplier = event.target.value;
			console.log(this.ingredients);
		}
	}

	public getValue(ingredient) {
		if (ingredient.portion === undefined) {
			return Math.round(this.unitGrams * ingredient.multiplier);
		} else {
			return ingredient.multiplier;
		}
	}

	public getStep(ingredient) {
		if (ingredient.portion === undefined) {
			return 1;
		} else {
			return 0.1;
		}
	}

	public saveMeal() {
		console.log(this.mealName);
		const meal = new Meal(this.mealName);
		meal.ingredients = this.ingredients;
		const self = this;
		const closeCallBack = () => {
			self.closeModal();
		};
		this.mealService.insertMeal(meal, closeCallBack);
	}

	public closeModal() {
		this.close.emit(true);
	}

	private getAllFood() {
		this.foodService.getAllFood().subscribe(
			data => {
				this.food = data;
				this.getFoodSearchableList(data);
			},
			error => console.log(error)
		);
	}

	private getFoodSearchableList(food) {
		const foodList = new Array();

		for (const item of food) {
			const matchZonderPortion = new FoodSearchable(item, undefined);
			foodList.push(matchZonderPortion);

			if (item.portions) {
				for (const portion of item.portions) {
					foodList.push(new FoodSearchable(item, portion));
				}
			}
		}
		this.foodAndPortions = foodList;
	}

}
