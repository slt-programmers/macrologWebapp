import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../../model/ingredient';
import { StoreDishRequest } from '../../model/storeDishRequest';
import { DishService } from '../../services/dish.service';

@Component({
	selector: 'app-dishes',
	templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.scss']
})
export class DishesComponent implements OnInit {

	public allDishes: Dish[];
	public modalIsVisible = false;

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

  public getPortion(ingredient:Ingredient, portionId:long) {
     console.log(ingredient);
     for (const portion of ingredient.food.portions) {
       if (portion.id == portionId) {
          return portion;
       }
     }
     console.log("Unknown portion");
  }
  public getIngredientDescription(ingredient: Ingredient) {
     if (ingredient.portionId){
        let usedPortion=  this.getPortion(ingredient, ingredient.portionId);
        return ingredient.multiplier + " " + usedPortion.description;
     } else {
        return ingredient.multiplier * 100  + " gram";
     }
  }

	public getTotal(dish: Dish) {
		return dish.macrosCalculated;
	}
}
