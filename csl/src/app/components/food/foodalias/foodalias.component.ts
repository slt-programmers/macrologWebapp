import { Component, OnInit,Input } from '@angular/core';
import { FoodService } from '../../../services/food.service';

@Component({
  selector: 'foodalias',
  templateUrl: './foodalias.component.html',
  styleUrls: ['./foodalias.component.scss']
})
export class FoodAliasComponent implements OnInit {

  public food;

  @Input() foodId='';

  constructor(private foodService: FoodService) { }

    ngOnInit() {
      this.foodService.getFood(this.foodId).subscribe(
        data => this.food = data;
      );
    };


}
