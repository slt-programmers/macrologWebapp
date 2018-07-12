import { Component, OnInit, OnChanges, ViewChild, SimpleChanges, ElementRef, Input } from '@angular/core';
import {LogEntry} from '../../model/logEntry';
import { FoodService } from '../../services/food.service';
@Component({
  selector: 'log-meal',
  templateUrl: './log-meal.component.html',
  styleUrls: ['./log-meal.component.scss']
})
export class LogMealComponent implements OnInit {

  @Input() meal:string;
  @Input() logEntries:LogEntry[];


  public editable:boolean = false;
  constructor(private foodService: FoodService) { }

  ngOnInit() {

  }

	onChange() {
	}

  calculateProtein(currEntry){
     if (currEntry.portion){
        return (currEntry.multiplier * currEntry.portion.macros.protein);
     } else {
        if (currEntry.food.measurementUnit == "UNIT"){
           return (currEntry.multiplier * currEntry.food.unitGrams * currEntry.food.protein);
        } else {
           return (currEntry.multiplier * currEntry.food.protein);
        }
     }
  }
  calculateFat(currEntry){
    if (currEntry.portion){
        return (currEntry.multiplier * currEntry.portion.macros.fat);
     } else {
        if (currEntry.food.measurementUnit == "UNIT"){
           return (currEntry.multiplier * currEntry.food.unitGrams * currEntry.food.fat);
        } else {
           return (currEntry.multiplier * currEntry.food.fat);
        }
     }
  }
  calculateCarbs(currEntry){
     if (currEntry.portion){
        return (currEntry.multiplier * currEntry.portion.macros.carbs);
     } else {
        if (currEntry.food.measurementUnit == "UNIT"){
           return (currEntry.multiplier * currEntry.food.unitGrams * currEntry.food.carbs);
        } else {
           return (currEntry.multiplier * currEntry.food.carbs);
        }
     }
  }
  calculateCalories(currEntry){
    console.log(this.calculateFat(currEntry) * 9 + this.calculateProtein(currEntry) * 4 + this.calculateCarbs(currEntry) * 4);

     return this.calculateFat(currEntry) * 9 + this.calculateProtein(currEntry) * 4 + this.calculateCarbs(currEntry) * 4;
  }

  getPortions(food) {

//     var portions = this.foodService.getFood(food.id).subscribe(
//			result => {
//			      portions = result;
 //           console.log(portions);
 //    });
  return 0;
  }

}
