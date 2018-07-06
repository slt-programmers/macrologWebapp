import { Component, OnInit, Output, EventEmitter } from '@angular/core';

class Portion {
	constructor() {
		public grams: number = 0;
		public unit: number = 0;
		public description: string = '';
	}
}

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
	public grams;
	public protein: number;
	public fat: number;
	public carbs: number;

	public portions = [];

  constructor() {
	}

  ngOnInit() {
  }

	closeModal() {
		this.close.emit(true);
	}

	newPortion() {
		console.log(this.portions);

		console.log('new portion');
		let newP = new Portion();
		console.log(newP);
		console.log('before adding: ');
		console.log(this.portions);

		this.portions.push(newP);
		console.log('after adding: ');
		console.log(this.portions);
	}

	removePortion(index) {
		// start removing from index
		// remove 1 item
		this.portions.splice(index, 1);
	}

}
