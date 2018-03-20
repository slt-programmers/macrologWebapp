import { Component } from '@angular/core';
import { FoodService } from './services/food.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  	title = 'Macrolog Webapp';
	foodResult: String = '';
	newFoodResult;

	constructor(private foodService: FoodService) {}

	ngOnInit() {

	}

	insertFood() {
		this.foodService.insertFood().subscribe(
			data => this.newFoodResult = data
		);
	}


}
