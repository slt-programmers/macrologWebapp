import { Component, Input, ViewChild, ElementRef, Output, EventEmitter, HostListener } from '@angular/core';
import { FoodSearchable } from '../../model/foodSearchable';
import { Food } from '../../model/food';
import { DishService } from '../../services/dish.service';
import { Dish } from '../../model/dish';
import { Macros } from '../../model/macros';
import { Store } from '@ngrx/store';
import { selectAllFood } from '../../store/selectors/food.selectors';

@Component({
  selector: 'ml-autocomplete-food',
  templateUrl: './autocomplete-food.component.html',
  styleUrls: ['./autocomplete-food.component.scss'],
})
export class AutocompleteFoodComponent {
  @HostListener('document.click', ['$event.target'])
  onClick(target: ElementRef) {
    this.closeAutoComplete(target);
  }

  @ViewChild('newIngredient', { static: false })
  private newIngredientEref: ElementRef;
  @ViewChild('autoComplete', { static: false })
  private autoCompleteEref: ElementRef;

  @Input() dummy = false;
  @Input() placeholder = '';
  @Input() selectFn: Function;
  @Input() includeDishes = false;
  @Output() select$: EventEmitter<FoodSearchable> = new EventEmitter<FoodSearchable>();

  public searchables: any[]
  public foodMatch = new Array();
  public foodName: string;
  public showAutoComplete: boolean;
  public allFood: Food[];
  public allDishes: Dish[];

  constructor(private readonly store: Store, private readonly dishService: DishService) {
    this.store.select(selectAllFood).subscribe(it => {
      this.allFood = it;
      this.getFoodSearchableList();
    });
    this.dishService.getAllDishes().subscribe(it => {
      this.allDishes = it;
      this.getFoodSearchableList();
    });
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
      this.select$.emit(match);
    }
  }

  public getDescription(foodSearchable: FoodSearchable) {
    if (foodSearchable.dish) {
      return foodSearchable.dish.name + ' (dish)';
    }
    return foodSearchable.food.name;
  }

  private getFoodSearchableList(): void {
    if (!this.dummy) {

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
      const macros: Macros = {};
      macros.protein = 0.8;
      macros.fat = 0.0;
      macros.carbs = 24;
      const portion = {
        macros: macros,
        grams: 200,
        description: 'piece'
      }
      item.portions.push(portion);

      const searchable: FoodSearchable = { food: item };
      this.searchables = [];
      this.searchables.push(searchable);
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
    const classList: string[] = []
    activeElement.classList.forEach(it => {
      if (it.startsWith('option-')) {
        classList.push(it);
      }
    });
    const className = classList[0];
    const index = className.charAt(className.length - 1);
    return +index;
  }

  private closeAutoComplete(target: ElementRef) {
    if (this.newIngredientEref && !this.newIngredientEref.nativeElement.contains(target)) {
      this.showAutoComplete = false;
      this.foodMatch = [];
    }
  }
}
