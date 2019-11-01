import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Food } from '../../model/food';
import { Portion } from '../../model/portion';
import { FoodService } from '../../services/food.service';
import { ScrollBehaviourService } from '../../services/scroll-behaviour.service';

@Component({
	selector: 'add-food-modal',
	templateUrl: './add-food-modal.component.html'
})
export class AddFoodModalComponent implements OnInit {

	@Input() food: Food;

	@Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

	public title = 'Add food';
	public name = '';
	public unitName = 'gram';
	public unitGrams = 100.00;
	public protein: number;
	public fat: number;
	public carbs: number;
	public portions: Portion[] = [];

	constructor(private foodService: FoodService,
		private scrollBehaviourService: ScrollBehaviourService) {
	}

	ngOnInit() {
		this.scrollBehaviourService.preventScrolling(true);
		if (this.food) {
			this.title = 'Edit food';
			this.name = this.food.name;
			this.protein = this.food.protein;
			this.fat = this.food.fat;
			this.carbs = this.food.carbs;

			if (this.food.portions) {
				// To make a deep copy of the portions array
				this.portions = JSON.parse(JSON.stringify(this.food.portions));
			} else {
				this.portions = [];
			}
		}
	}

	public saveFood() {
		const addFoodRequest = new Food(this.name,
			this.protein,
			this.fat,
			this.carbs);
		if (this.food) {
			addFoodRequest.id = this.food.id;
		}
		addFoodRequest.portions = this.portions;

		this.foodService.addFood(addFoodRequest, this.getCloseCallback());
	}

	public closeModal() {
		this.scrollBehaviourService.preventScrolling(false);
		this.close.emit(true);
	}

	public isNewPortion(portion: Portion) {
		if (portion.id !== null && portion.id !== undefined && portion.id !== 0) {
			return false;
		}
		return true;
	}

	public addNewPortion() {
		this.portions.push(new Portion());
	}

	public removePortion(index: number) {
		this.portions.splice(index, 1);
	}

	getCloseCallback(): Function {
		const self = this;
		return () => {
			self.closeModal();
		};
	}
}
