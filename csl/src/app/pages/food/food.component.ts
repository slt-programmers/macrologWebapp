import{Component, OnInit}from '@angular/core';
import {FoodService}from '../../services/food.service';

@Component({
  selector: 'app-food',
  templateUrl: './food.component.html',
  styleUrls: ['./food.component.scss']
})
export class FoodComponent implements OnInit {

  public foodResult;

  constructor(private foodService: FoodService) { }

	ngOnInit() {
    this.foodService.getAllFood().subscribe(
      data => { this.foodResult = data;
        console.log(this.foodResult);
      },
			error => console.log(error)
		);
  };

}
