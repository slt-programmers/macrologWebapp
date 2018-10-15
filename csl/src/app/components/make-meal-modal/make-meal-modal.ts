import {Component, OnInit, Output, Input, EventEmitter} from '@angular/core';
import {Food} from '../../model/food';
import {Meal} from '../../model/meal';
import {Ingredient} from '../../model/ingredient';
import {FoodSearchable} from '../../model/foodSearchable';
import {FoodService} from '../../services/food.service';
import {MealService} from '../../services/meal.service';

@Component({
  selector: 'make-meal-modal',
  templateUrl: './make-meal-modal.html'
})
export class MakeMealModal implements OnInit {

	@Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

	public modalTitle = 'Make a meal';
	public mealName = '';
	public food;
	public foodAndPortions = new Array();
	public addIngredientCallBack: Function;
	public ingredients: Ingredient[] = new Array();

  constructor(private foodService: FoodService,
              private mealService: MealService) {
	}

  ngOnInit() {
		this.getAllFood();
		this.addIngredientCallBack = this.addIngredient.bind(this);
  }

	addIngredient(foodSearchable: FoodSearchable) {
		let ingredient = new Ingredient();
		ingredient.food = foodSearchable.food;
		ingredient.foodId = ingredient.food.id;
		ingredient.portion = foodSearchable.portion;
		if (ingredient.portion != undefined) {
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
		if (ingredient.food.measurementUnit == 'GRAMS' && ingredient.portion == undefined) {
			ingredient.multiplier = (event.target.value / ingredient.food.unitGrams);
			console.log(ingredient.multiplier);
			console.log(this.ingredients);
		} else {
			ingredient.multiplier = event.target.value;
			console.log(this.ingredients);
		}
	}

	getValue(ingredient) {
		if (ingredient.food.measurementUnit == 'GRAMS' && ingredient.portion == undefined) {
			return Math.round(ingredient.food.unitGrams * ingredient.multiplier);
		} else {
			return ingredient.multiplier;
		}
	}

	getStep(ingredient) {
		if(ingredient.food.measurementUnit == 'GRAMS' && ingredient.portion == undefined) {
			return 1;
		} else {
			return 0.1;
		}
	}

	saveMeal() {
		console.log(this.mealName);
		let meal = new Meal(this.mealName);
		meal.ingredients = this.ingredients;
    let self = this;
		let closeCallBack = () => {
			self.closeModal();
		}
		this.mealService.insertMeal(meal,closeCallBack);
	}

	closeModal() {
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
		let foodList = new Array();

		for (let item of food) {
      let matchZonderPortion = new FoodSearchable(item,undefined);
			foodList.push(matchZonderPortion);

			if (item.portions) {
				 for (let portion of item.portions) {
           foodList.push(new FoodSearchable(item,portion));
				 }
			}
		}
		this.foodAndPortions = foodList;
	}

}
