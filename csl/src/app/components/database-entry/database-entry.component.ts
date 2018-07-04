import {Component,Input} from'@angular/core';
import {FoodService} from '../../../services/food.service';
import {Food} from '../../../model/food'

@Component({
  selector: 'database-entry',
  templateUrl: './database-entry.component.html',
  styleUrls: ['./database-entry.component.scss']
})
export class DatabaseEntryComponent {

  @Input() food: string;

	model = {name: '',
		selectedUnit: 0,
		unitName: '',
		unitGrams: 0,
		protein: 0,
		fat: 0,
		carbs: 0
	};

	constructor(public foodService: FoodService) {
		this.model.selectedUnit = 1;
	}

	onClose(): void {
	}

	onSubmit(): void {
		console.log(this.model);
		let food = new Food(this.model.name,
						this.model.selectedUnit,
						this.model.unitName,
						this.model.unitGrams,
						this.model.protein,
						this.model.fat,
						this.model.carbs)
		console.log(food);
		//this.foodService.insertFoodTwo(food);
		this.foodService.insertFood();
	}

}
