import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../../shared/services/user.service';
import { Gender } from '../../../shared/model/gender';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { calculateTDEE } from 'src/app/util/functions';
import { differenceInYears, isValid, parse } from 'date-fns';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'ml-onboarding',
  templateUrl: './onboarding.component.html',
  styleUrls: ['./onboarding.component.scss'],
})
export class OnboardingComponent implements OnInit {
  @ViewChild('breakfast', { static: false }) private breakfastEref: any;

  // Step 2
  public protein: number;
  public fat: number;
  public carbs: number;
  public calories: number;
  public tdee: number;
  public markers: any[];
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

  public userForm: FormGroup;
  public currentStep: number;

  constructor(private userService: UserService, private router: Router) {
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
    const data = this.userForm.value;
    this.protein = data.weight * 1.8;
    this.fat = data.weight * 0.8;
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
    const data = this.userForm.value;
    const birthdayDate = parse(data.birthday, 'dd-MM-yyyy', new Date());
    if (isValid(birthdayDate)) {
      age = differenceInYears(new Date(), birthdayDate);
      const bmr = calculateTDEE(data.gender, data.weight, data.height, age);
      this.tdee = bmr * data.activity;
    }
  }

  setMarkers() {
    this.markers = [
      { title: 'deficit', value: this.tdee - 200 },
      { title: 'baseline', value: this.tdee },
      { title: 'surplus', value: this.tdee + 200 },
    ];
  }

  calcCarbs(): void {
    this.carbs = (this.calories - this.protein * 4.0 - this.fat * 9.0) / 4.0;
  }

  changeCalories(event: any) {
    this.calories = event;
    this.calcCarbs();
  }

  calcCaloriesManual(): void {
    this.calories =
      this.proteinManual * 4 + this.fatManual * 9 + this.carbsManual * 4;
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
    if (this.showMacros) {
      forkJoin([
        this.userService.addUserSetting('goalProtein', Math.round(this.proteinManual).toString()),
        this.userService.addUserSetting('goalFat', Math.round(this.fatManual).toString()),
        this.userService.addUserSetting('goalCarbs', Math.round(this.carbsManual).toString()),
      ]).subscribe(
        () => { this.nextStep(); },
        (error) => console.error(error)
      );
    } else {
      forkJoin([
        this.userService.addUserSetting('goalProtein', Math.round(this.protein).toString()),
        this.userService.addUserSetting('goalFat', Math.round(this.fat).toString()),
        this.userService.addUserSetting('goalCarbs', Math.round(this.carbs).toString()),
      ]).subscribe(
        () => { this.nextStep(); },
        (error) => console.error(error)
      );
    }
  }

  dummy() { 
    // Intentionally empty
  }

  finish() {
    this.router.navigate(['/dashboard']);
  }
}
