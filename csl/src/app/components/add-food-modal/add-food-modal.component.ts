import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Food } from '../../model/food';
import { Portion } from '../../model/portion';
import { FoodService } from '../../services/food.service';

export enum MeasurementUnit {
	Grams = "GRAMS",
	Unit = "UNIT"
}

@Component({
  selector: 'add-food-modal',
  templateUrl: './add-food-modal.component.html'
})
export class AddFoodModalComponent implements OnInit {

	@Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

	public title = 'Add food to the database';
	public name = '';
	public measurementUnit = 'grams';
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
		let addFoodRequest = new Food();
		addFoodRequest.name = this.name;
		addFoodRequest.measurementUnit = this.measurementUnit;
		if (this.measurementUnit === 'unit') {
			addFoodRequest.unitName = this.unitName;
			addFoodRequest.unitGrams = this.unitGrams;
		}
		addFoodRequest.protein = this.protein;
		addFoodRequest.fat = this.fat;
		addFoodRequest.carbs = this.carbs;
		addFoodRequest.portions = this.portions;

		this.foodService.addFood(addFoodRequest);
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
