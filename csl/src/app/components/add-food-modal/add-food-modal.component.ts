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

	@Input() food;

	@Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

	public title = 'Add food';
	public name = '';
	public unitName = '';
	public unitGrams: number;
	public protein: number;
	public fat: number;
	public carbs: number;
	public portions = [];

	constructor(private foodService: FoodService,
							private sbs: ScrollBehaviourService) {
	}

	ngOnInit() {
		this.sbs.preventScrolling(true);
		if (this.food) {
			this.title  = 'Edit food';
			this.name = this.food.name;
			this.unitName = this.food.unitName;
			this.unitGrams = this.food.unitGrams;
			this.protein = this.food.protein;
			this.fat = this.food.fat;
			this.carbs = this.food.carbs;

			if (this.food.portions) {
				this.portions = this.food.portions;
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

		const self = this;
		const closeCallBack = () => {
			self.closeModal();
		};

		this.foodService.addFood(addFoodRequest, closeCallBack);
	}

	public closeModal() {
		this.sbs.preventScrolling(false);
		this.close.emit(true);
	}

	public newPortion() {
		this.portions.push(new Portion());
	}

	public removePortion(index) {
		this.portions.splice(index, 1);
	}
}
