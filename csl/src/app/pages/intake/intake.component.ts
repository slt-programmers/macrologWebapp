import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Gender } from '../../model/gender';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { Router } from '@angular/router';

@Component({
  selector: 'app-intake',
  templateUrl: './intake.component.html'
})
export class IntakeComponent implements OnInit {

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
	public showMoreOptions: boolean = false;

  constructor(private userService: UserService,
              private router: Router) { }

  ngOnInit() {
		this.currentStep = 1;
		this.gender = Gender.Male;
  }

	nextStep() {
		this.currentStep = this.currentStep + 1;
		this.initStepTwo();
	}

	previousStep() {
		this.currentStep = this.currentStep - 1;
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

	toggleOptions(toggle: boolean) {
		if (toggle) {
			this.proteinManual = Math.round(this.protein);
			this.fatManual = Math.round(this.fat);
			this.carbsManual = Math.round(this.carbs);
		}

		this.showMoreOptions = toggle;
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
		if (this.showMoreOptions) {
			forkJoin(
				this.userService.addUserInfo('goalProtein', Math.round(this.proteinManual).toString()),
				this.userService.addUserInfo('goalFat', Math.round(this.fatManual).toString()),
				this.userService.addUserInfo('goalCarbs', Math.round(this.carbsManual).toString())
      ).subscribe(
          data => {
						this.router.navigate(['/log']);
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
						this.router.navigate(['/log']);
           },
          error => console.error(error)
			);
		}
	}

}
