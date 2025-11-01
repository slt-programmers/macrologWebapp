import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { calculateTDEE } from 'src/app/util/functions';
import { differenceInYears, isValid, parse } from 'date-fns';
import { FormControl, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DatePipe, NgIf } from '@angular/common';
import { Meal } from 'src/app/shared/model/meal';
import { StepperComponent } from '../../../shared/components/stepper/stepper.component';
import { EntryPageRowComponent } from '../diary/entry-page-row/entry-page-row.component';

@Component({
    selector: 'ml-onboarding',
    templateUrl: './onboarding.component.html',
    styleUrls: ['./onboarding.component.scss'],
    imports: [StepperComponent, NgIf, FormsModule, ReactiveFormsModule, EntryPageRowComponent]
})
export class OnboardingComponent implements OnInit {
  @ViewChild('breakfast', { static: false }) private breakfastEref: any;

  // Step 2
  public protein: number;
  public fat: number;
  public carbs: number;
  public calories: number;
  public tdee: number;

  // Step 3
  public expandMoreInfo = false;

  // Step 4
  public displayDate;
  public datePipe = new DatePipe('en-US');
  public breakfastOpen = false;
  public breakfast = Meal.Breakfast;
  public foodSearchables = new Array();

  public userForm: FormGroup;
  public currentStep: number;

  constructor(private userService: UserService, private router: Router) {
    this.displayDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd');
    this.userForm = new FormGroup({
      name: new FormControl('', Validators.required),
      birthday: new FormControl('', Validators.required),
      gender: new FormControl('MALE', Validators.required),
      height: new FormControl('', Validators.required),
      weight: new FormControl('', Validators.required),
      activity: new FormControl('', Validators.required)
    });
  }

  ngOnInit() {
    this.currentStep = 1;
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
    const birthdayDate = parse(data.birthday, 'dd-MM-yyyy', new Date());
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
        this.userService.addUserSetting('name', data.name),
        this.userService.addUserSetting('birthday', data.birthday.toString()),
        this.userService.addUserSetting('gender', data.gender.toString()),
        this.userService.addUserSetting('height', data.height.toString()),
        this.userService.addUserSetting('weight', data.weight.toString()),
        this.userService.addUserSetting('activity', data.activity.toString()),
      ]).subscribe(
        () => {
          this.nextStep()
        },
        (error) => console.error(error)
      );
    }
  }

  public saveIntake() {
    forkJoin([
      this.userService.addUserSetting('goalProtein', Math.round(this.protein).toString()),
      this.userService.addUserSetting('goalFat', Math.round(this.fat).toString()),
      this.userService.addUserSetting('goalCarbs', Math.round(this.carbs).toString()),
    ]).subscribe(
      () => { this.nextStep(); },
      (error) => console.error(error)
    );
  }

  dummy() {
    // Intentionally empty
  }

  finish() {
    this.router.navigate(['/dashboard']);
  }
}
