import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FoodSearchable } from '../../model/foodSearchable';
import { Food } from '../../model/food';
import { FoodService } from '../../services/food.service';
import { DishService } from '../../services/dish.service';
import { Dish } from '../../model/dish';
import { Portion } from '../../model/portion';
import { Macros } from '../../model/macros';

@Component({
  templateUrl: './autocomplete-food.component.html',
  selector: 'autocomplete-food',
  styleUrls: ['./autocomplete-food.component.scss'],
  host: { '(document: click)': 'closeAutoComplete($event)' },
})
export class AutocompleteFoodComponent {
  @ViewChild('newIngredient', { static: false })
  private newIngredientEref: ElementRef;
  @ViewChild('autoComplete', { static: false })
  private autoCompleteEref: ElementRef;

  @Input() dummy = false;
  @Input() placeholder = '';
  @Input() selectFn: Function;
  @Input() includeDishes = false;
  @Output() select: EventEmitter<FoodSearchable> = new EventEmitter<FoodSearchable>();

  public searchables: any[]
  public foodMatch = new Array();
  public foodName: string;
  public showAutoComplete: boolean;
  public allFood: Food[];
  public allDishes: Dish[];

  constructor(private readonly foodService: FoodService, private readonly dishService: DishService) {
    this.foodService.getAllFood().subscribe(it => {
      this.allFood = it;
      this.getFoodSearchableList();
    });
    this.dishService.getAllDishes().subscribe(it => {
      this.allDishes = it;
      this.getFoodSearchableList();
    });
  }

  private getFoodSearchableList(): void {
    if(!this.dummy) {

      if (!!this.allFood && !!this.allDishes) {
        const searchList = [];
        for (const item of this.allFood) {
          const searchable: FoodSearchable = { food: item };
          searchList.push(searchable);
        }
        if (this.includeDishes) {
          for (const dish of this.allDishes) {
            searchList.push({ dish: dish });
          }
        }
        this.searchables = searchList;
      }
    } else {
      const item: Food = { name: 'Apple', protein: 0.4, fat: 0.0, carbs: 12 };
      item.portions = [];
      const portion = new Portion();
      const macros: Macros = {};
      macros.protein = 0.8;
      macros.fat = 0.0;
      macros.carbs = 24;
      portion.macros = macros;
      portion.grams = 200;
      portion.description = 'piece';
      item.portions.push(portion);
  
      const searchable: FoodSearchable = { food: item };
      this.searchables = [];
      this.searchables.push(searchable);
    }
  }

  public findFoodMatch(event: any) {
    this.foodMatch = new Array<Food>();
    if (event.data !== null) {
      for (const item of this.searchables) {
        let matchFoodName = false;
        let matchDishName = false;
        if (item.food) {
          matchFoodName = item.food.name.toLowerCase().indexOf(this.foodName.toLowerCase()) >= 0;
        } else {
          matchDishName = item.dish.name.toLowerCase().indexOf(this.foodName.toLowerCase()) >= 0;
        }
        if (matchFoodName || matchDishName) {
          this.foodMatch.push(item);
        }
      }
    }
  }

  public onKeyDown(event: any) {
    if (this.autoCompleteEref) {
      if (event.key === 'ArrowDown') {
        event.preventDefault();
        this.handleArrowDown();
      }
      if (event.key === 'ArrowUp') {
        event.preventDefault();
        this.handleArrowUp();
      }
      if (event.key === 'Enter') {
        event.preventDefault();
        this.handleEnter();
      }
    }
  }

  public selectMatch(match: FoodSearchable) {
    this.foodName = '';
    this.showAutoComplete = false
    if (this.selectFn) {
      this.selectFn(match)
    } else {
      this.select.emit(match);
    }
  }

  private handleArrowDown() {
    const activeElement = document.activeElement;
    if (activeElement.classList.contains('autocomplete__input')) {
      const element = document.getElementsByClassName('option-0')[0] as HTMLElement;
      if (element) {
        element.focus();
      }
    } else {
      const index = this.getCurrentOptionIndex();
      const element = document.getElementsByClassName('option-' + (index + 1))[0] as HTMLElement;
      if (element) {
        element.focus();
      }
    }
  }

  private handleEnter() {
    const index = this.getCurrentOptionIndex();
    this.selectMatch(this.foodMatch[index]);
  }

  private handleArrowUp() {
    const activeElement = document.activeElement;
    if (activeElement.classList.contains('autocomplete__option')) {
      const index = this.getCurrentOptionIndex();
      if (index === 0) {
        const element = document.getElementsByClassName('autocomplete__input')[0] as HTMLElement;
        element.focus();
      } else {
        const element = document.getElementsByClassName('option-' + (index - 1))[0] as HTMLElement;
        element.focus();
      }
    }
  }

  private getCurrentOptionIndex(): number {
    const activeElement = document.activeElement;
    const classList: String[] = []
    activeElement.classList.forEach(it => {
      if (it.startsWith('option-')) {
        classList.push(it);
      }
    });
    const className = classList[0];
    const index = className.charAt(className.length - 1);
    return +index;
  }

  public getDescription(foodSearchable: FoodSearchable) {
    if (foodSearchable.dish) {
      return foodSearchable.dish.name + ' (dish)';
    }
    return foodSearchable.food.name;
  }

  public closeAutoComplete(event: any) {
    // Event vuurt 4x door 4 log-meal-components
    if (
      this.newIngredientEref &&
      !this.newIngredientEref.nativeElement.contains(event.target)
    ) {
      this.showAutoComplete = false;
      this.foodMatch = [];
    }
  }
}
