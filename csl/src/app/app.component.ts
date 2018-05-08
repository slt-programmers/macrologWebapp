import { Component, OnInit } from '@angular/core';
import { FoodService } from './services/food.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title: string;
  newFoodResult: {};

  constructor(private foodService: FoodService) {}

  ngOnInit() {
    this.title = 'Macrolog Webapp';
  }

  insertFood() {
    this.foodService.insertFood().subscribe(
      data => this.newFoodResult = data
    );
  }


}
