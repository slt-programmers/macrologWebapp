import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Gender } from '../../../model/gender';
import { Food } from '../../../model/food';
import { Portion } from '../../../model/portion';
import { Macros } from '../../../model/macro';
import { FoodSearchable } from '../../../model/foodSearchable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Router } from '@angular/router';
import * as moment from 'moment';
import { calculateTDEE } from '@app/util/functions';

@Component({
	selector: 'app-onboarding',
	templateUrl: './onboarding.component.html',
	styleUrls: ['./onboarding.component.scss'],
	host: { '(document: click)': 'documentClick($event)' }
})
export class OnboardingComponent implements OnInit {

	@ViewChild('breakfast', { static: false }) private breakfastEref;

	// Step 1
	public name: string;
	public birthday: string; // D-M-YYYY
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

	// Step 3
	public showCalories = false;
	public showMacros = false;
	public expandMoreInfo = false;

	// Step 4
	public displayDate = new Date();
	public breakfastOpen = false;
	public foodSearchables = new Array();

	public currentStep: number;

	constructor(private userService: UserService,
		private router: Router) {
		const item = new Food('Apple', 0.4, 0.0, 12);
		item.portions = [];
		const portion = new Portion();
		const macros = new Macros();
		macros.protein = 0.8;
		macros.fat = 0.0;
		macros.carbs = 24;
		portion.macros = macros;
		portion.grams = 200;
		portion.description = 'piece';
		item.portions.push(portion);

		const searchable = new FoodSearchable(item);
		this.foodSearchables.push(searchable);
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
		window.scroll(0, 0);
	}

	previousStep() {
		this.currentStep = this.currentStep - 1;
		window.scroll(0, 0);
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
		let age: number;
		const birthdayDate = moment(this.birthday, 'D-M-YYYY', true);
		if (birthdayDate.isValid()) {
			age = moment().diff(birthdayDate, 'years');
		}
		const bmr = calculateTDEE(this.gender, this.weight, this.height, age);
		this.tdee = bmr * this.activity;
	}

	setMarkers() {
		this.markers = [{ title: 'deficit', value: (this.tdee - 200) },
		{ title: 'baseline', value: (this.tdee) },
		{ title: 'surplus', value: (this.tdee + 200) }];
	}

	calcCarbs(): void {
		this.carbs = (this.calories - (this.protein * 4.0) - (this.fat * 9.0)) / 4.0;
	}

	changeCalories(event: any) {
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
			this.userService.addUserSetting('name', this.name),
			this.userService.addUserSetting('birthday', this.birthday.toString()),
			this.userService.addUserSetting('gender', this.gender.toString()),
			this.userService.addUserSetting('height', this.height.toString()),
			this.userService.addUserSetting('weight', this.weight.toString()),
			this.userService.addUserSetting('activity', this.activity.toString())
		).subscribe(
			() => this.nextStep(),
			error => console.error(error)
		);
	}

	public saveIntake() {
		if (this.showMacros) {
			forkJoin(
				this.userService.addUserSetting('goalProtein', Math.round(this.proteinManual).toString()),
				this.userService.addUserSetting('goalFat', Math.round(this.fatManual).toString()),
				this.userService.addUserSetting('goalCarbs', Math.round(this.carbsManual).toString())
			).subscribe(
				() => {
					this.nextStep();
				},
				error => console.error(error)
			);
		} else {
			forkJoin(
				this.userService.addUserSetting('goalProtein', Math.round(this.protein).toString()),
				this.userService.addUserSetting('goalFat', Math.round(this.fat).toString()),
				this.userService.addUserSetting('goalCarbs', Math.round(this.carbs).toString())
			).subscribe(
				() => {
					this.nextStep();
				},
				error => console.error(error)
			);
		}
	}

	dummy() {
	}

	private documentClick(event: any) {
		if (this.breakfastEref &&
			!event.target.classList.contains('autocomplete__option') &&
			!event.target.classList.contains('trash') &&
			!event.target.classList.contains('button--transparent')) {
			this.breakfastOpen = this.breakfastEref.logMealEref.nativeElement.contains(event.target);
		}
	}

	finish() {
		this.router.navigate(['/log']);
	}
}
