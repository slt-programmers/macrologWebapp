import {Component} from'@angular/core';
import {MatDialog, MatDialogRef}from '@angular/material';
import {FoodService} from '../../../services/food.service';
import {Food} from '../../../model/food'

@Component({
  selector: 'app-database-entry',
  templateUrl: './database-entry.component.html',
  styleUrls: ['./database-entry.component.css']
})
export class DatabaseEntryComponent {

	model = {name: '',
		selectedUnit: 0,
		unitName: '',
		unitGrams: 0,
		protein: 0,
		fat: 0,
		carbs: 0
	};

	constructor(public dialogRef: MatDialogRef<DatabaseEntryComponent>,
				public foodService: FoodService) {
		this.model.selectedUnit = 1;
	}

	onClose(): void {
		this.dialogRef.close();
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
		this.foodService.insertFood(food);
		this.dialogRef.close();
	}

}