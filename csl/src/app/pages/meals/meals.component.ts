import { Component, OnInit } from '@angular/core';
import { Meal } from '../../model/meal';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html'
})
export class MealsComponent implements OnInit {

	public meals: Meal[] = new Array();
	public modalIsVisible: boolean = false;

  constructor() { }

  ngOnInit() {
  }

	openModal() {
		this.modalIsVisible = true;
	}

	closeModal(event) {
		this.modalIsVisible = !event;
	}

}
