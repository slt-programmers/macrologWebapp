import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AutocompleteFoodComponent } from 'src/app/shared/components/autocomplete-food/autocomplete-food.component';
import { Dish } from 'src/app/shared/model/dish';
import { Food } from 'src/app/shared/model/food';
import { FoodSearchable } from 'src/app/shared/model/foodSearchable';

@Component({
  selector: 'ml-edit-plan-mealtime',
  imports: [RouterLink, FontAwesomeModule, AutocompleteFoodComponent],
  templateUrl: './edit-plan-mealtime.html',
  styles: `
    :host {
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
  `
})
export class EditPlanMealtime {
  faChevronLeft = faChevronLeft;
  faPlus = faPlus;
  faTrash = faTrash;

  items: Array<Food | Dish> = []

  selectItem(foodOrDish: FoodSearchable) {
    if (foodOrDish.food) {
      this.items.push(foodOrDish.food)
    } else if (foodOrDish.dish) {
      this.items.push(foodOrDish.dish)
    }
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
  }

  isDish(item: Object): boolean {
    return 'ingredients' in item;
  }

  asDish(item: Object): Dish {
    return item as Dish
  }
}
