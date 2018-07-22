import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {LogService} from '../../services/log.service';
import {UserService} from '../../services/user.service';
import {FoodService} from '../../services/food.service';
import {LogEntry} from '../../model/logEntry';
import {Food} from '../../model/food';
import {FoodSearchable} from '../../model/foodSearchable';

import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'log',
  templateUrl: './log.component.html',
  styleUrls: ['./log.component.scss'],
	host: { '(document: click)': 'documentClick($event)' }
})
export class LogComponent implements OnInit {

	@ViewChild('breakfast') private breakfastEref;
	@ViewChild('lunch') private lunchEref;
	@ViewChild('dinner') private dinnerEref;
	@ViewChild('snacks') private snacksRef;

	public modalIsVisible: boolean = false;
	public getLogEntriesComplete: boolean = false;

  public allLogs;
	public food;
  public foodAndPortions;
  public displayDate;
	private pipe: DatePipe;

  public breakfastLogs = new Array<LogEntry>();
  public lunchLogs = new Array<LogEntry>();
  public dinnerLogs = new Array<LogEntry>();
  public snacksLogs = new Array<LogEntry>();

	public userGoals;
	public goalCal;

	constructor(private foodService: FoodService,
							private userService: UserService,
							private http: HttpClient,
							private logService: LogService) {
		this.displayDate = new Date();
    this.pipe = new DatePipe('en-US');
	}

	ngOnInit() {
		this.getUserGoals();
		this.getAllFood();
    this.getLogEntries(this.pipe.transform(this.displayDate, 'yyyy-MM-dd'));
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

	public getDifferentDay(event) {
		this.displayDate = event;
    this.getLogEntries(this.pipe.transform(this.displayDate, 'yyyy-MM-dd'));
	}

	public openModal() {
		this.modalIsVisible = true;
	}

	public closeModal(event) {
    console.log('refreshed');
		this.modalIsVisible = false;
		this.getAllFood();
	}

	private getUserGoals() {
		this.userService.getUserGoalStats().subscribe(
			data => {
				this.userGoals = data;
				this.setGoalCal();
			},
			error => console.log(error)
		);
	}

	private getAllFood() {
		this.foodService.getAllFood().subscribe(
			data => {
        this.food = data;
				this.getFoodSearchableList(data);
			},
			error => { console.log(error); }
		);
	}

  private getLogEntries(date){
    this.logService.getDayLogs(date).subscribe(
      data => {
        this.allLogs = data;
				this.breakfastLogs = new Array();
        this.breakfastLogs = this.allLogs.filter(
            entry => entry.meal === 'BREAKFAST'
        );
				this.lunchLogs = new Array();
        this.lunchLogs = this.allLogs.filter(
            entry => entry.meal === 'LUNCH'
        );
				this.dinnerLogs = new Array();
        this.dinnerLogs = this.allLogs.filter(
            entry => entry.meal === 'DINNER'
        );
				this.snacksLogs = new Array();
        this.snacksLogs = this.allLogs.filter(
            entry => entry.meal === 'SNACKS'
        );
      },
			error => { console.log(error);
				this.allLogs = new Array();
				this.breakfastLogs = new Array();
				this.lunchLogs = new Array();
				this.dinnerLogs = new Array();
				this.snacksLogs = new Array();
			},
			() => this.getLogEntriesComplete = true
		);
  }

  // Maakt een lijst met daarin food en food + alle mogelijke portions
	private getFoodSearchableList(food) {
    console.log('reconstruct searchable food');
		let foodList = new Array();

		for (let item of food) {
      let matchZonderPortion = new FoodSearchable(item,undefined);
			foodList.push(matchZonderPortion);

			if (item.portions) {
				 for (let portion of item.portions) {
           foodList.push(new FoodSearchable(item,portion));
				 }
			}
		}

		this.foodAndPortions = foodList;
	}

	private setGoalCal() {
		if (this.userGoals) {
		  this.goalCal = (this.userGoals[0] * 4)
		    + (this.userGoals[1] * 9)
		    + (this.userGoals[2] * 4);
		}
	}

	private documentClick(event) {
		console.log('target:');
		console.log(event.target);
		console.log(this.breakfastEref);
		console.log(this.breakfastEref.logMealEref.nativeElement);
		let bool = this.breakfastEref.logMealEref.nativeElement.contains(event.target);
		console.log(bool);
		if (bool) {
			console.log('click in breakfast log-meal');
		}
	}
}
