import { Component, Input, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { FoodSearchable } from '../../model/foodSearchable';
import { Food } from '../../model/food';

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

  @Input() placeholder = '';
  @Input() selectFn: Function;
  @Input() searchables: FoodSearchable[];
  @Output() select: EventEmitter<FoodSearchable> = new EventEmitter<FoodSearchable>();

  public foodMatch = new Array();
  public foodName: string;
  public showAutoComplete: boolean;

  constructor() { }

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
    const element = document.activeElement;

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
