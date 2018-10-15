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
		console.log('getting all meals');
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

	public getTotal(meal: Meal, macro: string) {
		let macros = {
			protein: 0,
			fat: 0,
			carbs: 0
		}

		for (let ingredient of meal.ingredients) {
			if(ingredient.portion == undefined) {
				macros.protein += (ingredient.food.protein * ingredient.multiplier)
				macros.fat += (ingredient.food.fat * ingredient.multiplier)
				macros.carbs += (ingredient.food.carbs * ingredient.multiplier)
			} else {
				macros.protein += (ingredient.portion.macros.protein * ingredient.multiplier)
				macros.fat += (ingredient.portion.macros.fat * ingredient.multiplier)
				macros.carbs += (ingredient.portion.macros.carbs * ingredient.multiplier)
      }
		}
		return macros;
	}

}
