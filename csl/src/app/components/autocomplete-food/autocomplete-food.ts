import {Component, Input, OnInit, OnChanges, ViewChild, ElementRef, Renderer} from '@angular/core';
import {FoodSearchable} from '../../model/foodSearchable';
import {FoodService} from '../../services/food.service';
import {Food} from '../../model/food';

@Component({
	templateUrl: './autocomplete-food.html',
	selector: 'autocomplete-food',
	host: { '(document: click)': 'closeAutoComplete($event)' }
})
export class AutocompleteFood implements OnInit, OnChanges {

	@ViewChild('newIngredient') private newIngredientEref: ElementRef;
	@ViewChild('autoComplete') private autoCompleteEref: ElementRef;

	@Input() placeholder: string = '';
	@Input() selectFn: Function;
	@Input() food;

	public foodMatch = new Array();
	public foodName: string;
  public foodAndPortions;
	public showAutoComplete: boolean;

	constructor(private foodService: FoodService, private renderer: Renderer) {}

	ngOnInit() {
	}

	ngOnChanges() {}

	public findFoodMatch(event) {
		console.log(event);
		this.foodMatch = new Array<Food>();
		if (event.data !== null) {
			console.log(this.food);
			for (let item of this.food) {
				console.log(item);
        let matchFoodName = item.food.name.toLowerCase().indexOf(this.foodName.toLowerCase()) >= 0;
				if (matchFoodName) {
					this.foodMatch.push(item);
				}
			}
		}
	}

	public onKeyDown(event) {
		let autoCompleteInputSelected = document.activeElement.classList.contains('autocomplete__input');
		let autoCompleteOptionSelected = document.activeElement.classList.contains('autocomplete__option');
		let nodelist = this.autoCompleteEref.nativeElement.childNodes;

		if(this.autoCompleteEref) {
			if(autoCompleteInputSelected) {
				if(event.key === 'ArrowDown') {
					event.preventDefault();
					for (let index = 0; index < nodelist.length; index++) {
						if (nodelist[index].localName === 'div') {
							this.renderer.invokeElementMethod(nodelist[index], 'focus');
							break;
						}
					}
				}
			} else if (autoCompleteOptionSelected) {
				if(event.key === 'ArrowDown') {
					event.preventDefault();
					let activeElement = document.activeElement;
					let nextSibling = activeElement.nextSibling;
					for (;;) {
						if (nextSibling && nextSibling.localName !== 'div') {
							nextSibling = nextSibling.nextSibling;
						} else if (nextSibling) {
							this.renderer.invokeElementMethod(nextSibling, 'focus');
							break;
						} else {
							break;
						}
					}
				} else if (event.key === 'ArrowUp') {
					event.preventDefault();
					let activeElement = document.activeElement;
					let previousSibling = activeElement.previousSibling;
					for (;;) {
						if (previousSibling && previousSibling.localName !== 'div') {
							previousSibling = previousSibling.previousSibling;
						} else if(previousSibling) {
							this.renderer.invokeElementMethod(previousSibling, 'focus');
							break;
						} else {
							break;
						}
					}
				}
			}
		}
	}

  public matchDescription(foodSearchable) {
		if (foodSearchable.portion) {
      return foodSearchable.food.name + " (" + foodSearchable.portion.description + ")";
    } else {
			if (foodSearchable.food.measurementUnit == "UNIT"){
        return foodSearchable.food.name + " (" + foodSearchable.food.unitName +" )";
      } else {
        return foodSearchable.food.name + " (" + foodSearchable.food.unitGrams  + " " + foodSearchable.food.unitName +" )";
			}
    }
  }

	public closeAutoComplete(event) {
		//Event vuurt 4x door 4 log-meal-components
		if (this.newIngredientEref && !this.newIngredientEref.nativeElement.contains(event.target)) {
			this.showAutoComplete = false;
		}
	}
}