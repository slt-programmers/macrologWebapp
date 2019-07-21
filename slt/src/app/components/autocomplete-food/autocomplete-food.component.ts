import { Component, Input, ViewChild, ElementRef, Renderer } from '@angular/core';
import { FoodSearchable } from '../../model/foodSearchable';
import { Food } from '../../model/food';

@Component({
	templateUrl: './autocomplete-food.component.html',
	selector: 'autocomplete-food',
	host: { '(document: click)': 'closeAutoComplete($event)' }
})
export class AutocompleteFoodComponent {

	@ViewChild('newIngredient', { static: false }) private newIngredientEref: ElementRef;
	@ViewChild('autoComplete', { static: false }) private autoCompleteEref: ElementRef;

	@Input() placeholder = '';
	@Input() selectFn: Function;
	@Input() searchables: FoodSearchable[];

	public foodMatch = new Array();
	public foodName: string;
	public showAutoComplete: boolean;

	constructor(private renderer: Renderer) { }

	public findFoodMatch(event: any) {
		this.foodMatch = new Array<Food>();
		if (event.data !== null) {
			for (const item of this.searchables) {
				const matchFoodName = item.food.name.toLowerCase().indexOf(this.foodName.toLowerCase()) >= 0;
				if (matchFoodName) {
					this.foodMatch.push(item);
				}
			}
		}
	}

	public onKeyDown(event: any) {
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
					let current = activeElement.nextSibling;
					while (true) {
						if (current && current.nodeName !== 'div') {
							current = current.nextSibling;
						} else if (current) {
							this.renderer.invokeElementMethod(current, 'focus');
							break;
						} else {
							break;
						}
					}
				} else if (event.key === 'ArrowUp') {
					event.preventDefault();
					const activeElement = document.activeElement;
					let current = activeElement.previousSibling;
					while (true) {
						if (current && current.nodeName !== 'div') {
							current = current.previousSibling;
						} else if (current) {
							this.renderer.invokeElementMethod(current, 'focus');
							break;
						} else {
							break;
						}
					}
				}
			}
		}
	}

	public matchDescription(foodSearchable: FoodSearchable) {
		if (foodSearchable.dish) {
			return foodSearchable.dish.name;
		}
		return foodSearchable.food.name;
	}

	public closeAutoComplete(event: any) {
		// Event vuurt 4x door 4 log-meal-components
		if (this.newIngredientEref && !this.newIngredientEref.nativeElement.contains(event.target)) {
			this.showAutoComplete = false;
			this.foodMatch = [];
		}
	}
}
