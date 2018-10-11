import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Gender } from '../../model/gender';
import { Food } from '../../model/food';
import { FoodSearchable } from '../../model/foodSearchable';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intake',
  templateUrl: './intake.component.html',
	host: { '(document: click)': 'documentClick($event)' }
})
export class IntakeComponent implements OnInit {

	@ViewChild('breakfast') private breakfastEref;

	// Step 1
	public name: string;
	public age: number;
	public gender: Gender;
	public height: number;
	public weight: number;
	public activity: number;

	// Step 1
	public protein: number;
	public fat: number;
	public carbs: number;
	public calories: number;
	public tdee: number;
	public markers;
	public proteinManual: number;
	public fatManual: number;
	public carbsManual: number;


	public currentStep: number;

	// Step 3
	public showCalories: boolean = false;
	public showMacros: boolean =  false;
	public expandMoreInfo: boolean = false;

	// Step 4
	public displayDate = new Date();
	public breakfastOpen = false;
  public food = new Array();


  constructor(private userService: UserService,
              private router: Router) {
		const item = new Food('Apple', 'UNIT', 0.5, 0.3, 25);
		item.unitName = 'piece';
		item.unitGrams = 182;
    const foodItem = new FoodSearchable(item, undefined);
    this.food.push(foodItem);
		console.log(this.food);
	}

  ngOnInit() {
		this.currentStep = 1;
		this.gender = Gender.Male;
  }

	nextStep() {
		this.currentStep = this.currentStep + 1;
		if (this.currentStep === 2) {
			this.initStepTwo();
		}
		window.scroll(0,0);
	}

	previousStep() {
		this.currentStep = this.currentStep - 1;
		window.scroll(0,0);
	}

	initStepTwo() {
		this.protein = this.weight * 1.8;
		this.fat = this.weight * 0.8;
		this.calcCalories();
	}

	calcCalories(): void {
		this.calcTDEE();
		this.setMarkers();
		this.calories = this.tdee;
		this.calcCarbs();
	}

	calcTDEE(): void {
		let bmr;
		if (this.gender === 'MALE') {
			bmr = 66.5 + (13.7 * this.weight) + (5 * this.height) - (6.76 * this.age);
		} else {
			bmr = 655.0 + (9.56 * this.weight) + (1.8 * this.height) - (4.68 * this.age);
		}
		this.tdee = bmr * this.activity;
	}

	setMarkers() {
		this.markers = [{title: 'deficit', value: (this.tdee - 200)},
		{title: 'baseline', value: (this.tdee)},
		{title: 'surplus', value: (this.tdee + 200)}];
	}

	calcCarbs(): void {
		this.carbs = (this.calories - (this.protein * 4.0) - (this.fat * 9.0)) / 4.0;
	}

	changeCalories(event) {
		this.calories = event;
		this.calcCarbs();
	}

	calcCaloriesManual(): void {
		this.calories = (this.proteinManual * 4) + (this.fatManual * 9) + (this.carbsManual * 4);
	}

	showCaloriesTab() {
		this.showCalories = true;
		this.showMacros = false;
	}

	showMacrosTab() {
		this.showCalories = false;
		this.showMacros = true;

		this.proteinManual = Math.round(this.protein);
		this.fatManual = Math.round(this.fat);
		this.carbsManual = Math.round(this.carbs);
	}

	public saveUserSettings(): void {
    forkJoin(
			this.userService.addUserInfo('name', this.name),
			this.userService.addUserInfo('age', this.age.toString()),
			this.userService.addUserInfo('gender', this.gender.toString()),
			this.userService.addUserInfo('height', this.height.toString()),
			this.userService.addUserInfo('weight', this.weight.toString()),
			this.userService.addUserInfo('activity', this.activity.toString())
    ).subscribe(
        data => this.nextStep(),
        error => console.error(error)
    );
	}

	public saveIntake() {
		if (this.showMacros) {
			forkJoin(
				this.userService.addUserInfo('goalProtein', Math.round(this.proteinManual).toString()),
				this.userService.addUserInfo('goalFat', Math.round(this.fatManual).toString()),
				this.userService.addUserInfo('goalCarbs', Math.round(this.carbsManual).toString())
      ).subscribe(
          data => {
						this.nextStep();
           },
          error => console.error(error)
			);
		} else {
			forkJoin(
				this.userService.addUserInfo('goalProtein', Math.round(this.protein).toString()),
				this.userService.addUserInfo('goalFat', Math.round(this.fat).toString()),
				this.userService.addUserInfo('goalCarbs', Math.round(this.carbs).toString())
			).subscribe(
					data => {
						this.nextStep();
           },
          error => console.error(error)
			);
		}
	}

	dummy() {
	}

	private documentClick(event) {
		if (this.breakfastEref &&
				!event.target.classList.contains('autocomplete__option') &&
		    !event.target.classList.contains('fa-trash') &&
		    !event.target.classList.contains('button--transparent')) {

			this.breakfastOpen = this.breakfastEref.logMealEref.nativeElement.contains(event.target);
		}
	}


	finish() {
		this.router.navigate(['/log']);
	}

}
