import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Ingredient } from '../../../shared/model/ingredient';
import { Dish } from '../../../shared/model/dish';
import { Portion } from 'src/app/shared/model/portion';
import { FoodSearchable } from 'src/app/shared/model/foodSearchable';
import { Food } from 'src/app/shared/model/food';
import { Store } from '@ngrx/store';
import { dishesActions } from 'src/app/shared/store/actions/dishes.actions';
import { selectAllDishes } from 'src/app/shared/store/selectors/dishes.selectors';
import { Subscription } from 'rxjs';
import { PiechartComponent } from '../../../shared/components/piechart/piechart.component';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { FormsModule } from '@angular/forms';
import { AutocompleteFoodComponent } from '../../../shared/components/autocomplete-food/autocomplete-food.component';

@Component({
    selector: 'ml-dishes',
    templateUrl: './dishes.component.html',
    imports: [PiechartComponent, ModalComponent, FormsModule, AutocompleteFoodComponent]
})
export class DishesComponent implements OnInit, OnDestroy {
  private readonly store = inject(Store);

  public allDishes: Dish[] = [];
  public selectedDish?: Dish;
  public modalIsVisible = false;

  public modalTitle = '';
  public dishName = '';
  public ingredients: Ingredient[] = [];

  public food: Food[] = [];
  public searchables: FoodSearchable[] = [];
  public unitName = 'grams';

  private unitGrams = 100.0;
  private subscription?: Subscription;

  ngOnInit() {
    this.store.dispatch(dishesActions.get());
    this.subscription = this.store.select(selectAllDishes).subscribe(it => {
      this.allDishes = it;
    });
  }

  public openModal(dish: Dish | null): void {
    if (dish) {
      this.modalTitle = 'Edit dish';
      const ingredients = [];
      for (const ingredient of dish.ingredients) {
        ingredients.push({
          ...ingredient,
          portion: ingredient.portion? this.getPortion(ingredient, ingredient.portion.id!) : {}
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
  }

  public getPortion(ingredient: Ingredient, portionId: number): Portion {
    for (const portion of ingredient.food.portions!) {
      if (portion.id === portionId) {
        return portion;
      }
    }
    return {} as Portion;
  }

  public getIngredientDescription(ingredient: Ingredient): string {
    if (ingredient.portion) {
      const usedPortion = this.getPortion(ingredient, ingredient.portion.id!);
      return ingredient.multiplier + ' ' + usedPortion.description;
    } else {
      return ingredient.multiplier! * 100 + ' gram';
    }
  }

  public getTotal(dish: Dish) {
    return dish.macrosCalculated;
  }

  public addIngredient(foodSearchable: FoodSearchable) {
    const ingredient: Ingredient = { multiplier: 1, food: foodSearchable.food! };
    this.selectedDish!.ingredients.push(ingredient);
  }

  public saveDish(): void {
    this.store.dispatch(dishesActions.post(this.selectedDish));
    this.closeModal();
  }

  public removeIngredient(index: number): void {
    this.selectedDish!.ingredients.splice(index, 1);
  }

  public portionChange(ingredient: Ingredient, eventTarget: any) {
    if (eventTarget.value === this.unitName) {
      ingredient.portion = undefined;
    } else {
      for (const portion of ingredient.food.portions!) {
        if (portion.description === eventTarget.value) {
          ingredient.portion = portion;
          break;
        }
      }
    }
    ingredient.multiplier = 1;
  }

  public getStep(ingredient: Ingredient): number {
    if (ingredient.portion === undefined) {
      return 1;
    } else {
      return 0.1;
    }
  }

  public calculateMultiplier(event: any, ingredient: Ingredient): void {
    if (ingredient.portion === undefined) {
      ingredient.multiplier = event.target.value / this.unitGrams;
    } else {
      ingredient.multiplier = event.target.value;
    }
  }

  public getValue(ingredient: Ingredient): number {
    if (ingredient.portion === undefined) {
      return Math.round(this.unitGrams * ingredient.multiplier!);
    } else {
      return ingredient.multiplier!;
    }
  }

  public deleteDish(): void {
    this.store.dispatch(dishesActions.delete(this.selectedDish!.id));
    this.closeModal();
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
