import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Food } from '../../model/food';
import { FoodSearchable } from '../../model/foodSearchable';
import { FoodService } from '../../services/food.service';

@Component({
  selector: 'make-meal-modal',
  templateUrl: './make-meal-modal.html'
})
export class MakeMealModal implements OnInit {

	@Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

	public title = 'Make a meal';
	public food;
	public foodAndPortions = new Array();
	public addIngredientCallBack: Function;

  constructor(private foodService: FoodService) {
	}

  ngOnInit() {
		this.getAllFood();
		this.addIngredientCallBack = this.addIngredient.bind(this);
  }

	addIngredient(ingredient) {
		console.log(ingredient);
	}

	saveMeal() {

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
