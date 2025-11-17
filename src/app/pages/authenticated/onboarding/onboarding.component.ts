import { DatePipe } from "@angular/common";
import { Component, inject } from "@angular/core";
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { Router } from "@angular/router";
import { differenceInYears, isValid, parse } from "date-fns";
import { forkJoin } from "rxjs";
import { Meal } from "src/app/shared/model/meal";
import { calculateTDEE } from "src/app/util/functions";
import { StepperComponent } from "../../../shared/components/stepper/stepper.component";
import { UserService } from "../../../shared/services/user.service";

@Component({
	selector: "ml-onboarding",
	templateUrl: "./onboarding.component.html",
	styleUrls: ["./onboarding.component.css"],
	imports: [StepperComponent, FormsModule, ReactiveFormsModule],
})
export class OnboardingComponent {
	private userService = inject(UserService);
	private router = inject(Router);

	// Step 2
	public protein = 0;
	public fat = 0;
	public carbs = 0;
	public calories = 0;
	public tdee = 0;

	// Step 3
	public expandMoreInfo = false;

	// Step 4
	public datePipe = new DatePipe("en-US");
	public displayDate = this.datePipe.transform(new Date(), "yyyy-MM-dd")!;
	public breakfastOpen = false;
	public breakfast = Meal.Breakfast;
	public foodSearchables = [];

	public userForm: FormGroup;
	public currentStep = 1;

	constructor() {
		this.userForm = new FormGroup({
			name: new FormControl("", Validators.required),
			birthday: new FormControl("", Validators.required),
			gender: new FormControl("MALE", Validators.required),
			height: new FormControl("", Validators.required),
			weight: new FormControl("", Validators.required),
			activity: new FormControl("", Validators.required),
		});
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
		this.calcTDEE();
		this.fillStandard();
	}

	public fillStandard() {
		this.calories = Math.round(this.tdee);
		const data = this.userForm.value;
		this.protein = Math.round(data.weight * 1.8);
		this.fat = Math.round(data.weight * 0.8);
		this.calcCarbs();
	}

	calcTDEE(): void {
		let age: number;
		const data = this.userForm.value;
		const birthdayDate = parse(data.birthday, "dd-MM-yyyy", new Date());
		if (isValid(birthdayDate)) {
			age = differenceInYears(new Date(), birthdayDate);
			const bmr = calculateTDEE(data.gender, data.weight, data.height, age);
			this.tdee = bmr * data.activity;
		}
	}

	calcCarbs(): void {
		this.carbs = (this.calories - this.protein * 4.0 - this.fat * 9.0) / 4.0;
	}

	calcCalories(): void {
		this.calories = this.protein * 4 + this.fat * 9 + this.carbs * 4;
	}

	public saveUserSettings(): void {
		this.userForm.markAllAsTouched();
		if (this.userForm.valid) {
			const data = this.userForm.value;
			forkJoin([
				this.userService.addUserSetting("name", data.name),
				this.userService.addUserSetting("birthday", data.birthday.toString()),
				this.userService.addUserSetting("gender", data.gender.toString()),
				this.userService.addUserSetting("height", data.height.toString()),
				this.userService.addUserSetting("weight", data.weight.toString()),
				this.userService.addUserSetting("activity", data.activity.toString()),
			]).subscribe(
				() => {
					this.nextStep();
				},
				(error) => console.error(error)
			);
		}
	}

	public saveIntake() {
		forkJoin([
			this.userService.addUserSetting(
				"goalProtein",
				Math.round(this.protein).toString()
			),
			this.userService.addUserSetting(
				"goalFat",
				Math.round(this.fat).toString()
			),
			this.userService.addUserSetting(
				"goalCarbs",
				Math.round(this.carbs).toString()
			),
		]).subscribe(
			() => {
				this.nextStep();
			},
			(error) => console.error(error)
		);
	}

	dummy() {
		// Intentionally empty
	}

	finish() {
		this.router.navigate(["/dashboard"]);
	}
}
