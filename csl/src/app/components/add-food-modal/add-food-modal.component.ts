import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'add-food-modal',
  templateUrl: './add-food-modal.component.html'
})
export class AddFoodModalComponent implements OnInit {

	@Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

	public title = 'Add food to the database';
	public nutrients = 'grams';

  constructor() { }

  ngOnInit() {
  }

	closeModal() {
		this.close.emit(true);
	}

}
