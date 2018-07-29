import { Component, OnInit } from '@angular/core';
import { Meal } from '../../model/meal';
import { MealService } from '../../services/meal.service';

@Component({
  selector: 'app-meals',
  templateUrl: './meals.component.html'
})
export class MealsComponent implements OnInit {

	public allMeals: Meal[];
	public modalIsVisible: boolean = false;

  constructor(private mealService: MealService) { }

  ngOnInit() {
		this.getAllMeals();
  }

	public getAllMeals() {
		this.mealService.getAllMeals().subscribe(
			data => { this.allMeals = data;
			 console.log(data);
			 },
			error => console.log(error)
		);
	}

	openModal() {
		this.modalIsVisible = true;
	}

	closeModal(event) {
		this.modalIsVisible = !event;
		this.getAllMeals();
	}

}
