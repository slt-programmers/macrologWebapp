import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Food } from '../../model/food';
import { FoodService } from '../../services/food.service';

@Component({
  selector: 'make-meal-modal',
  templateUrl: './make-meal-modal.html'
})
export class MakeMealModal implements OnInit {

	@Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

	public title = 'Make a meal';

	private allFood: Food[] = new Array();

  constructor(private foodService: FoodService) {
	}

  ngOnInit() {

  }

	saveMeal() {

	}

	closeModal() {
		this.close.emit(true);
	}

}
