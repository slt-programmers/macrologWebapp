import { Component, OnInit } from '@angular/core';
import { Ingredient } from '../../../shared/model/ingredient';
import { Dish } from '../../../shared/model/dish';
import { DishService } from '../../../shared/services/dish.service';
import { Portion } from 'src/app/shared/model/portion';
import { FoodSearchable } from 'src/app/shared/model/foodSearchable';
import { FoodService } from 'src/app/shared/services/food.service';
import { Food } from 'src/app/shared/model/food';

@Component({
  selector: 'app-dishes',
  templateUrl: './dishes.component.html'
})
export class DishesComponent implements OnInit {
  public allDishes: Dish[] = [];
  public selectedDish: Dish;
  public modalIsVisible = false;

  public modalTitle: String;
  public dishName = '';
  public ingredients: Ingredient[] = [];

  public food: Food[] = [];
  public searchables: FoodSearchable[] = [];
  public unitName = 'grams';

  private unitGrams = 100.0;

  constructor(private dishService: DishService, private readonly foodService: FoodService) { }

  ngOnInit() {
    this.getAllDishes();
  }

  public openModal(dish: Dish): void {
    if (!!dish) {
      this.modalTitle = 'Edit dish';
      const ingredients = [];
      for (let ingredient of dish.ingredients) {
        ingredients.push({
          ...ingredient,
          portion: this.getPortion(ingredient, ingredient.portionId)
        });
      }
      this.selectedDish = { ...dish, ingredients: ingredients };
    } else {
      this.modalTitle = 'Make a dish';
      this.selectedDish = {
        name: '',
        ingredients: []
      }
    }
    this.modalIsVisible = true;
  }

  public closeModal(): void {
    this.modalIsVisible = false;
    this.selectedDish = undefined;
    this.getAllDishes();
  }

  public getPortion(ingredient: Ingredient, portionId: number): Portion {
    for (const portion of ingredient.food.portions) {
      if (portion.id === portionId) {
        return portion;
      }
    }
    return {} as Portion;
  }

  public getIngredientDescription(ingredient: Ingredient): string {
    if (ingredient.portionId) {
      const usedPortion = this.getPortion(ingredient, ingredient.portionId);
      return ingredient.multiplier + ' ' + usedPortion.description;
    } else {
      return ingredient.multiplier * 100 + ' gram';
    }
  }

  public getTotal(dish: Dish) {
    return dish.macrosCalculated;
  }

  public addIngredient(foodSearchable: FoodSearchable) {
    const ingredient: Ingredient = { multiplier: 1 };
    ingredient.food = foodSearchable.food;
    this.selectedDish.ingredients.push(ingredient);
  }

  public saveDish() {
    console.log(this.selectedDish);
    this.dishService.addDish(this.selectedDish).subscribe(it => {
      this.closeModal();
    });
  }

  public removeIngredient(index: number) {
    this.selectedDish.ingredients.splice(index, 1);
  }

  public portionChange(ingredient: Ingredient, eventTarget: any) {
    if (eventTarget.value === this.unitName) {
      ingredient.portion = undefined;
      ingredient.portionId = undefined;
    } else {
      for (const portion of ingredient.food.portions) {
        if (portion.description === eventTarget.value) {
          ingredient.portion = portion;
          ingredient.portionId = portion.id;
          break;
        }
      }
    }
    ingredient.multiplier = 1;
  }

  public getStep(ingredient: Ingredient) {
    if (ingredient.portion === undefined) {
      return 1;
    } else {
      return 0.1;
    }
  }

  public calculateMultiplier(event: any, ingredient: Ingredient) {
    if (ingredient.portion === undefined) {
      ingredient.multiplier = event.target.value / this.unitGrams;
    } else {
      ingredient.multiplier = event.target.value;
    }
  }

  public getValue(ingredient: Ingredient) {
    if (ingredient.portion === undefined) {
      return Math.round(this.unitGrams * ingredient.multiplier);
    } else {
      return ingredient.multiplier;
    }
  }

  public deleteDish() {
    this.dishService.deleteDish(this.selectedDish).subscribe(it => {
      this.closeModal();
    })
  }

  private getAllDishes(): void {
    this.dishService.getAllDishes().subscribe(it => {
      this.allDishes = it;
      this.allDishes.sort((a, b) => a.name.localeCompare(b.name));
    });
  }
}
