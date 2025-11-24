import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faChevronLeft, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { AutocompleteFoodComponent } from 'src/app/shared/components/autocomplete-food/autocomplete-food.component';
import { FoodSearchable } from 'src/app/shared/model/foodSearchable';
import { Ingredient } from 'src/app/shared/model/ingredient';

@Component({
  selector: 'ml-edit-plan-mealtime',
  imports: [RouterLink, FontAwesomeModule, AutocompleteFoodComponent, FormsModule],
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

  items: Ingredient[] = [];

  selectItem(foodOrDish: FoodSearchable): void {
    if (foodOrDish.food) {
      const food = foodOrDish.food;
      const portion = food.portions[0];
      this.items.push({
        food,
        portion: portion,
        multiplier: 1
      })
    } else if (foodOrDish.dish) {
      this.items.push(...foodOrDish.dish.ingredients);
    }
  }

  changeMultiplier(multiplier: number, index: number):void {
    if (!this.items[index].portion) {
      this.items[index].multiplier = multiplier / 100;
    } else {
      this.items[index].multiplier = multiplier;
    }
  }

  removeItem(index: number): void {
    this.items.splice(index, 1);
  }

  save(): void {
    
  }

}
