import { Component, Input, OnInit, OnChanges, ViewChild, ElementRef, Renderer } from '@angular/core';
import { FoodSearchable } from '../../model/foodSearchable';
import { FoodService } from '../../services/food.service';
import { Food } from '../../model/food';

@Component({
	templateUrl: './autocomplete-food.component.html',
	selector: 'autocomplete-food',
	host: { '(document: click)': 'closeAutoComplete($event)' }
})
export class AutocompleteFoodComponent implements OnInit, OnChanges {

	@ViewChild('newIngredient',  {static: false}) private newIngredientEref: ElementRef;
	@ViewChild('autoComplete',  {static: false}) private autoCompleteEref: ElementRef;

	@Input() placeholder = '';
	@Input() selectFn: Function;
	@Input() food: FoodSearchable[];

	public foodMatch = new Array();
	public foodName: string;
	public foodAndPortions;
	public showAutoComplete: boolean;

	constructor(private foodService: FoodService, private renderer: Renderer) {}

	ngOnInit() {
	}

	ngOnChanges() {}

	public findFoodMatch(event) {
		this.foodMatch = new Array<Food>();
		if (event.data !== null) {
			for (const item of this.food) {
				const matchFoodName = item.food.name.toLowerCase().indexOf(this.foodName.toLowerCase()) >= 0;
				if (matchFoodName) {
					this.foodMatch.push(item);
				}
			}
		}
	}

	public onKeyDown(event) {
		const autoCompleteInputSelected = document.activeElement.classList.contains('autocomplete__input');
		const autoCompleteOptionSelected = document.activeElement.classList.contains('autocomplete__option');
		const nodelist = this.autoCompleteEref.nativeElement.childNodes;

		if (this.autoCompleteEref) {
			if (autoCompleteInputSelected) {
				if (event.key === 'ArrowDown') {
					event.preventDefault();
					for (let index = 0; index < nodelist.length; index++) {
						if (nodelist[index].localName === 'div') {
							this.renderer.invokeElementMethod(nodelist[index], 'focus');
							break;
						}
					}
				}
			} else if (autoCompleteOptionSelected) {
				if (event.key === 'ArrowDown') {
					event.preventDefault();
					const activeElement = document.activeElement;
					let nextSibling = activeElement.nextSibling;
					for (;;) {
						if (nextSibling && nextSibling.nodeName !== 'div') {
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
					const activeElement = document.activeElement;
					let previousSibling = activeElement.previousSibling;
					for (;;) {
						if (previousSibling && previousSibling.nodeName !== 'div') {
							previousSibling = previousSibling.previousSibling;
						} else if (previousSibling) {
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
			return foodSearchable.food.name + ' (' + foodSearchable.portion.description + ')';
		} else if (foodSearchable.food.ingredients) {
			return foodSearchable.food.name + ' (Meal)';
		} else {
			return foodSearchable.food.name + ' (100 gram)';
		}
	}

	public closeAutoComplete(event) {
		// Event vuurt 4x door 4 log-meal-components
		if (this.newIngredientEref && !this.newIngredientEref.nativeElement.contains(event.target)) {
			this.showAutoComplete = false;
		}
	}
}
