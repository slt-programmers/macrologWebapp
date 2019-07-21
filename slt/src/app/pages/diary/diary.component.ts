import { Component, OnInit, ViewChild } from '@angular/core';
import { DiaryService } from '../../services/diary.service';
import { ActivityService } from '../../services/activity.service';
import { UserService } from '../../services/user.service';
import { FoodService } from '../../services/food.service';
import { MealService } from '../../services/meal.service';
import { LogEntry } from '../../model/logEntry';
import { LogActivity } from '../../model/logActivity';
import { FoodSearchable } from '../../model/foodSearchable';
import { DatePipe } from '@angular/common';
import { Dish } from '@app/model/dish';
import { Food } from '@app/model/food';

@Component({
	selector: 'diary-page',
	templateUrl: './diary.component.html',
	host: { '(document: click)': 'documentClick($event)' }
})
export class DiaryComponent implements OnInit {

	@ViewChild('breakfast', { static: false }) private breakfastEref;
	@ViewChild('lunch', { static: false }) private lunchEref;
	@ViewChild('dinner', { static: false }) private dinnerEref;
	@ViewChild('snacks', { static: false }) private snacksEref;
	@ViewChild('activities', { static: false }) private activitiesEref;

	public modalIsVisible = false;
	public isLogMealOpen: boolean;
	public allLogs: LogEntry[];
	public food: Food[];
	public meals: Dish[];
	public searchableFood: FoodSearchable[];
	public displayDate: Date;
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

	public closeModal() {
		this.modalIsVisible = false;
		this.getAllFood();
	}

	private getUserGoals(date: string) {
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
		);
	}

	private getAllMeals() {
		this.mealService.getAllMeals().subscribe(
			data => {
				this.meals = data;
				this.getFoodSearchableList();
			},
		);
	}

	private getLogEntries(date: string) {
		this.logService.getDayLogs(date).subscribe(
			data => {
				console.log(data);
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
			error => {
				console.log(error);
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
			error => {
				console.log(error);
				this.activitiesLogs = new Array();
			}
		);

	}

	private getFoodSearchableList() {
		const searchables: Array<FoodSearchable> = [];

		for (const item of this.food) {
			const searchable = new FoodSearchable(item);
			searchables.push(searchable);
		}
		for (const meal of this.meals) {
			searchables.push(new FoodSearchable(undefined, meal));
		}

		this.searchableFood = searchables;
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
