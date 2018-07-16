import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {LogService}from '../../services/log.service';
import {UserService}from '../../services/user.service';
import {FoodService}from '../../services/food.service';
import {LogEntry} from '../../model/logEntry';
import {Food} from '../../model/food';

import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
  selector: 'log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss']
})
export class LogComponent implements OnInit {

	public modalIsVisible: boolean = false;

	constructor( private foodService: FoodService,
							 private userService: UserService,
							 private http: HttpClient,
							 private logService: LogService) { }

	public days;
  public allLogs;
	public food;
  public displayDate = new Date();

  public breakfastLogs = new Array<LogEntry>();
  public lunchLogs = new Array<LogEntry>();
  public dinnerLogs = new Array<LogEntry>();
  public snacksLogs = new Array<LogEntry>();

	public userGoals;
	public goalCal;

	ngOnInit() {
		this.foodService.getAllFood().subscribe(
			data => { this.food = data;
				this.getFoodPortionsList();
			},
			error => { console.log(error); }
		);

		this.userService.getUserGoalStats().subscribe(
			data => { this.userGoals = data;
			 this.goalCal = (this.userGoals[0] * 4) + (this.userGoals[1] * 9) + (this.userGoals[2] * 4);
			 },
			error => console.log(error)
		);
		console.log('usergoals');
		console.log(this.userGoals);

		this.getJson().subscribe(data => this.days = data,
					error => console.log(error));

    this.logService.getAllLogs().subscribe(
      data => {
          this.allLogs = data;
          this.breakfastLogs = this.allLogs.filter(
              entry => entry.meal === 'BREAKFAST'
          );
          this.lunchLogs = this.allLogs.filter(
              entry => entry.meal === 'LUNCH'
          );
          this.dinnerLogs = this.allLogs.filter(
              entry => entry.meal === 'DINNER'
          );
          this.snacksLogs = this.allLogs.filter(
              entry => entry.meal === 'SNACKS'
          );
      }
		);
  }

  public notifyLogMeal($event) {
     console.log('Notify received');
     console.log($event);
  }

	public getTotal(macro) {
		let total = 0.0;
		for (let logentry of this.breakfastLogs) {
				total += logentry.macrosCalculated[macro];
    }
		for (let logentry of this.lunchLogs) {
				total += logentry.macrosCalculated[macro];
    }
		for (let logentry of this.dinnerLogs) {
				total += logentry.macrosCalculated[macro];
    }
		for (let logentry of this.snacksLogs) {
				total += logentry.macrosCalculated[macro];
    }
		return total;
	}


	public openModal() {
		this.modalIsVisible = true;
	}

	public closeModal(event) {
		this.modalIsVisible = false;
	}

	private getJson() {
		return this.http.get("assets/logentries.json");
	}

	private getFoodPortionsList() {
		let foodList = new Array();

		for (let item of this.food) {
			foodList.push(item);

			if (item.portions) {
				for (let portion of item.portions) {

					let newItem = new Food();

					newItem.id = item.id;
					newItem.name = item.name;
					newItem.measurementUnit = item.measurementUnit;
					newItem.unitName = item.unitName;
					newItem.unitGrams = portion.grams;
					newItem.protein = portion. protein;
					newItem.fat = portion.fat;
					newItem.carbs = portion.carbs;

					foodList.push(newItem);
				}
			}
		}

		this.food = foodList;
	}

}
