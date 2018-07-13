import { Component, OnInit,Input } from '@angular/core';
import { FoodService } from '../../services/food.service';

@Component({
  selector: 'foodalias',
  templateUrl: './foodalias.component.html',
  styleUrls: ['./foodalias.component.scss']
})
export class FoodAliasComponent implements OnInit {

	@Input() foodId: string;

	public food;

  constructor(private foodService: FoodService) { }

	ngOnInit() {
		console.log(this.foodId);
    this.foodService.getFood(this.foodId).subscribe(
      data => this.food = data
    );
	};

}
