import { Component, OnInit, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DiaryService } from '../../services/diary.service';
import { ActivityService } from '../../services/activity.service';
import { UserService } from '../../services/user.service';
import { FoodService } from '../../services/food.service';
import { MealService } from '../../services/meal.service';
import { LogEntry } from '../../model/logEntry';
import { LogActivity } from '../../model/logActivity';
import { FoodSearchable } from '../../model/foodSearchable';
import { DatePipe } from '@angular/common';

@Component({
	selector: 'diary-page',
	templateUrl: './diary.component.html',
	host: { '(document: click)': 'documentClick($event)' }
})
export class DiaryComponent implements OnInit {

	@ViewChild('breakfast',  {static: false}) private breakfastEref;
	@ViewChild('lunch',  {static: false}) private lunchEref;
	@ViewChild('dinner',  {static: false}) private dinnerEref;
	@ViewChild('snacks',  {static: false}) private snacksEref;
	@ViewChild('activities',  {static: false})  private activitiesEref;

	public modalIsVisible = false;
	public isLogMealOpen: boolean;
	public allLogs;
	public food;
	public meals;
	public foodAndPortions;
	public displayDate;
	private pipe: DatePipe;

	public breakfastLogs = new Array<LogEntry>();
	public lunchLogs = new Array<LogEntry>();
	public dinnerLogs = new Array<LogEntry>();
	public snacksLogs = new Array<LogEntry>();
	public activitiesLogs = new Array<LogActivity>();

	public breakfastOpen = false;
	public lunchOpen = false;
	public dinnerOpen = false;
	public snacksOpen = false;
  public activitiesOpen = false;

	public userGoals;
	public goalCal;

	constructor(private foodService: FoodService,
							private userService: UserService,
							private http: HttpClient,
							private logService: DiaryService,
              private activityService: ActivityService,
							private mealService: MealService) {
		this.displayDate = new Date();
		this.pipe = new DatePipe('en-US');
	}

	ngOnInit() {
		this.getUserGoals(this.pipe.transform(this.displayDate, 'yyyy-MM-dd'));
		this.getAllFood();
		this.getLogEntries(this.pipe.transform(this.displayDate, 'yyyy-MM-dd'));
	}

	public refresh() {
		this.getLogEntries(this.pipe.transform(this.displayDate, 'yyyy-MM-dd'));
	}

	public getTotal(macro) {
		let total = 0.0;
		for (const logentry of this.breakfastLogs) {
			total += logentry.macrosCalculated[macro];
		}
		for (const logentry of this.lunchLogs) {
			total += logentry.macrosCalculated[macro];
		}
		for (const logentry of this.dinnerLogs) {
			total += logentry.macrosCalculated[macro];
		}
		for (const logentry of this.snacksLogs) {
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
    this.activitiesOpen = false;
		this.getUserGoals(this.pipe.transform(this.displayDate, 'yyyy-MM-dd'));
		this.getLogEntries(this.pipe.transform(this.displayDate, 'yyyy-MM-dd'));
	}

	public openModal() {
		this.modalIsVisible = true;
	}

	public closeModal(event) {
		this.modalIsVisible = false;
		this.getAllFood();
	}

	private getUserGoals(date) {

		this.userService.getUserGoalStats(date).subscribe(
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
				this.getAllMeals();
			},
			error => console.log(error)
		);
	}
	private getAllMeals() {
		this.mealService.getAllMeals().subscribe(
			data => {
				this.meals = data;
				this.getFoodSearchableList();
			},
			error => console.log(error)
		);
	}

	private getLogEntries(date) {
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
        this.activitiesLogs = new Array();
			}
		);
    this.activityService.getDayActivities(date).subscribe(
			data => {
        this.activitiesLogs = data;
			},
			error => { console.log(error);
        this.activitiesLogs = new Array();
			}
		);

	}

	// Maakt een lijst met daarin food en food + alle mogelijke portions
	private getFoodSearchableList() {
		const foodList = new Array();

		for (const item of this.food) {
			const matchZonderPortion = new FoodSearchable(item, undefined);
			foodList.push(matchZonderPortion);

			if (item.portions) {
				for (const portion of item.portions) {
					foodList.push(new FoodSearchable(item, portion));
				}
			}
		}
		for (const meal of this.meals) {
			foodList.push(new FoodSearchable(meal, undefined));
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
				!event.target.classList.contains('trash') &&
				!event.target.classList.contains('button--delete')) {

			this.breakfastOpen = this.breakfastEref.logMealEref.nativeElement.contains(event.target);
			this.lunchOpen = this.lunchEref.logMealEref.nativeElement.contains(event.target);
			this.dinnerOpen = this.dinnerEref.logMealEref.nativeElement.contains(event.target);
			this.snacksOpen = this.snacksEref.logMealEref.nativeElement.contains(event.target);
			this.activitiesOpen = this.activitiesEref.logActivityEref.nativeElement.contains(event.target);
		}
	}
}