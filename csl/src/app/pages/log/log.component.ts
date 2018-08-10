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
	host: { '(document: click)': 'documentClick($event)' }
})
export class LogComponent implements OnInit {

	@ViewChild('breakfast') private breakfastEref;
	@ViewChild('lunch') private lunchEref;
	@ViewChild('dinner') private dinnerEref;
	@ViewChild('snacks') private snacksEref;
	@ViewChild('toast') private toastEref;

	public modalIsVisible: boolean = false;
	public isLogMealOpen: boolean;
  public allLogs;
	public food;
  public foodAndPortions;
  public displayDate;
	private pipe: DatePipe;

  public breakfastLogs = new Array<LogEntry>();
  public lunchLogs = new Array<LogEntry>();
  public dinnerLogs = new Array<LogEntry>();
  public snacksLogs = new Array<LogEntry>();

	public breakfastOpen = false;
	public lunchOpen = false;
	public dinnerOpen = false;
	public snacksOpen = false;

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

  public refresh(){
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
		this.breakfastOpen = false;
		this.lunchOpen = false;
		this.dinnerOpen = false;
		this.snacksOpen = false;
    this.getLogEntries(this.pipe.transform(this.displayDate, 'yyyy-MM-dd'));
	}

	public openModal() {
		this.modalIsVisible = true;
	}

	public closeModal(event) {
		this.modalIsVisible = false;
		this.getAllFood();
	}

	private getUserGoals() {
		this.userService.getUserGoalStats().subscribe(
			data => {
				if (data[0] === null) {
					this.userGoals = null;
				} else {
					this.userGoals = data;
				}
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
			error => console.log(error)
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
			}
		);
  }

  // Maakt een lijst met daarin food en food + alle mogelijke portions
	private getFoodSearchableList(food) {
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
		if (!event.target.classList.contains('autocomplete__option') &&
		    !event.target.classList.contains('fa-trash') &&
		    !event.target.classList.contains('button--transparent')) {

			this.breakfastOpen = this.breakfastEref.logMealEref.nativeElement.contains(event.target);
			this.lunchOpen = this.lunchEref.logMealEref.nativeElement.contains(event.target);
			this.dinnerOpen = this.dinnerEref.logMealEref.nativeElement.contains(event.target);
			this.snacksOpen = this.snacksEref.logMealEref.nativeElement.contains(event.target);

		}
	}

}
