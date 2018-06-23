import { Component, OnInit } from '@angular/core';
import { FoodService } from '../../services/food.service';

@Component({
  selector: 'app-log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

  foodResult;

  constructor(private foodService: FoodService) { }

    ngOnInit() {
//      this.foodService.getAllFood().subscribe(
//        data => this.foodResult = data
//      );
    }

}
