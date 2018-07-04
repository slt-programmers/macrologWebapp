import { Component, OnInit } from '@angular/core';
import { DatabaseEntryComponent } from './database-entry/database-entry.component';
import { FoodService } from '../../services/food.service'

@Component({
  selector: 'app-database',
  templateUrl: './database.component.html',
  styleUrls: ['./database.component.scss']
})
export class DatabaseComponent implements OnInit {

  	constructor(public foodService: FoodService) {
  	}

	allFood;
	ngOnInit() {
		this.foodService.getAllFood().subscribe(
	        data => this.allFood = data
	    );
	}

 	openDialog(): void {

  }

}
