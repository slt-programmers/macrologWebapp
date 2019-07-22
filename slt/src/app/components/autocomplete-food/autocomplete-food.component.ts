import { Component, Input, ViewChild, ElementRef } from '@angular/core';
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

	constructor() { }

	public findFoodMatch(event: any) {
		this.foodMatch = new Array<Food>();
		if (event.data !== null) {
			for (const item of this.searchables) {
				let matchFoodName = false;
				let matchDishName = false;
				if (item.food) {
					matchFoodName = item.food.name.toLowerCase().indexOf(this.foodName.toLowerCase()) >= 0;
				} else if (item.dish) {
					matchDishName = item.dish.name.toLowerCase().indexOf(this.foodName.toLowerCase()) >= 0;
				}
				if (matchFoodName || matchDishName) {
					this.foodMatch.push(item);
				}
			}
		}
	}

	public onKeyDown(event: any) {
		const autoCompleteInputSelected = document.activeElement.classList.contains('autocomplete__input');
		const autoCompleteOptionSelected = document.activeElement.classList.contains('autocomplete__option');
		if (this.autoCompleteEref && (event.key === 'ArrowDown' || event.key === 'ArrowUp')) {
			const nodelist = this.autoCompleteEref.nativeElement.childNodes;
			if (autoCompleteInputSelected) {
				this.handleInputKeydown(event, nodelist)
			} else if (autoCompleteOptionSelected) {
				if (event.key === 'ArrowDown') {
					this.handleOptionKeydown(event)
				} else if (event.key === 'ArrowUp') {
					this.handleOptionKeyup(event)
				}
			}
		}
	}

	handleInputKeydown(event: any, nodelist: any) {
		if (event.key === 'ArrowDown') {
			event.preventDefault();
			for (let index = 0; index < nodelist.length; index++) {
				if (nodelist[index].localName === 'div') {
					nodelist[index].focus()
					break;
				}
			}
		}
	}

	handleOptionKeydown(event: any) {
		event.preventDefault();
		const activeElement = document.activeElement;
		let current = activeElement.nextSibling;
		while (true) {
			if (current && current.nodeName !== 'DIV') {
				current = current.nextSibling;
			} else if (current) {
				(current as HTMLElement).focus();
				break;
			} else {
				break;
			}
		}
	}

	handleOptionKeyup(event: any) {
		event.preventDefault();
		const activeElement = document.activeElement;
		let current = activeElement.previousSibling;
		while (true) {
			if (current && current.nodeName !== 'DIV') {
				current = current.previousSibling;
			} else if (current) {
				(current as HTMLElement).focus();
				break;
			} else {
				break;
			}
		}
	}

	public getDescription(foodSearchable: FoodSearchable) {
		if (foodSearchable.dish) {
			return foodSearchable.dish.name + ' (dish)'
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
