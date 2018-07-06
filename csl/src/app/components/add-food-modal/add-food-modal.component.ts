import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FoodEntry } from '../../model/foodEntry';
import { Portion } from '../../model/portion';
import { FoodService } from '../../services/food.service';


@Component({
  selector: 'add-food-modal',
  templateUrl: './add-food-modal.component.html'
})
export class AddFoodModalComponent implements OnInit {

	@Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

	public title = 'Add food to the database';
	public food = '';
	public nutrients = 'grams';
	public unitName = '';
	public unitGrams: number;
	public protein: number;
	public fat: number;
	public carbs: number;

	public portions = [];

  constructor(private foodService: FoodService) {
	}

  ngOnInit() {
  }

	addFood() {
		let foodEntry = new FoodEntry();
		foodEntry.food = this.food;
		foodEntry.unit = this.nutrients;
		if (this.nutrients === 'unit') {
			foodEntry.unitName = this.unitName;
			foodEntry.unitGrams = this.unitGrams;
		}
		foodEntry.protein = this.protein;
		foodEntry.fat = this.fat;
		foodEntry.carbs = this.carbs;
		foodEntry.portions = this.portions;

		this.foodService.addFood(foodEntry);

		this.closeModal();
	}

	closeModal() {
		this.close.emit(true);
	}

	newPortion() {
		this.portions.push(new Portion());
	}

	removePortion(index) {
		this.portions.splice(index, 1);
	}

}
