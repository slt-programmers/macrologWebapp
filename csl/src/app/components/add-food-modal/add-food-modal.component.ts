import { Component, OnInit, Output, EventEmitter } from '@angular/core';

class Portion {
	constructor() {
		public amount: string = '';
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

	public portions = [];

  constructor() { }

  ngOnInit() {
  }

	closeModal() {
		this.close.emit(true);
	}

	onNext() {
		this.currentStep = 'step2';
	}

	newPortion() {
		this.portions.push(new Portion());
	}

	removePortion(index) {
		// start removing from index
		// remove 1 item
		this.portions.splice(index, 1);
	}

}
