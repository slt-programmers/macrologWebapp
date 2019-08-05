import { Component, OnInit } from '@angular/core';
import { Dish } from '../../model/dish';
import { DishService } from '../../services/dish.service';

@Component({
	selector: 'app-dishes',
	templateUrl: './dishes.component.html'
})
export class DishesComponent implements OnInit {

	public allDishes: Dish[];
	public modalIsVisible = false;
	public unitName = 'gram';
	public unitGrams = 100.00;

	constructor(private dishService: DishService) { }

	ngOnInit() {
		this.getAllDishes();
	}

	public getAllDishes() {
		this.dishService.getAllDishes().subscribe(
			data => {
				this.allDishes = data;
			},
			error => console.log(error)
		);
	}

	openModal() {
		this.modalIsVisible = true;
	}

	closeModal(event) {
		this.modalIsVisible = !event;
		this.getAllDishes();
	}

	public getTotal(dish: Dish, macro: string) {
		const macros = {
			protein: 0,
			fat: 0,
			carbs: 0
		};

		for (const ingredient of dish.ingredients) {
			if (ingredient.portion === undefined) {
				macros.protein += (ingredient.food.protein * ingredient.multiplier);
				macros.fat += (ingredient.food.fat * ingredient.multiplier);
				macros.carbs += (ingredient.food.carbs * ingredient.multiplier);
			} else {
				macros.protein += (ingredient.portion.macros.protein * ingredient.multiplier);
				macros.fat += (ingredient.portion.macros.fat * ingredient.multiplier);
				macros.carbs += (ingredient.portion.macros.carbs * ingredient.multiplier);
			}
		}
		return macros;
	}
}
