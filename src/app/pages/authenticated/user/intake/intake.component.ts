import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { Gender } from '../../../../shared/model/gender';
import { differenceInYears, parse } from 'date-fns';
import { forkJoin } from 'rxjs';
import { calculateTDEE } from 'src/app/util/functions';

@Component({
  selector: 'ml-intake',
  templateUrl: './intake.component.html',
})
export class IntakeComponent implements OnInit {
  public goalProtein: number;
  public goalFat: number;
  public goalCarbs: number;

  public proteinManual: number;
  public fatManual: number;
  public carbsManual: number;

  public calories: number;

  public protein: number;
  public fat: number;
  public carbs: number;

  public age: number;
  public birthday: string;
  public gender: Gender;
  public height: number;
  public weight: number;
  public activity: number;

  public showCalcModal = false;
  public showCalories = false;
  public showMacros = false;

  public markers: Array<any>;
  private tdee: number;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserSettings().subscribe((result) => {
      this.birthday = result.birthday;
      this.gender = result.gender || Gender.Male;
      this.height = result.height;
      this.weight = result.currentWeight;
      this.activity = result.activity;

      this.goalProtein = result.goalProtein;
      this.goalFat = result.goalFat;
      this.goalCarbs = result.goalCarbs;

      const birthdayDate = parse(this.birthday, 'yyyy-MM-dd', new Date());
      this.age = differenceInYears(new Date(), birthdayDate);
    });
  }

  public openCalcModal(): void {
    this.showCaloriesTab();
    this.showCalcModal = true;
  }

  public closeCalcModal(): void {
    this.showCalcModal = false;
    this.showCalories = false;
    this.showMacros = false;
  }

  public calcCaloriesManual(): void {
    this.calories = this.proteinManual * 4 + this.fatManual * 9 + this.carbsManual * 4;
  }

  public changeCalories(event: number) {
    this.calories = event;
    this.calcCarbs();
  }

  public showCaloriesTab() {
    this.protein = this.weight * 1.8;
    this.fat = this.weight * 0.8;
    this.calcCalories();
    this.showCalories = true;
    this.showMacros = false;
  }

  public showMacrosTab() {
    this.calories = this.goalProtein * 4 + this.goalFat * 9 + this.goalCarbs * 4;
    this.showCalories = false;
    this.showMacros = true;
  }

  public saveIntake() {
    if (this.showMacros) {
      forkJoin([
        this.userService.addUserSetting('goalProtein', Math.round(this.proteinManual).toString()),
        this.userService.addUserSetting('goalFat', Math.round(this.fatManual).toString()),
        this.userService.addUserSetting('goalCarbs', Math.round(this.carbsManual).toString()),
      ]).subscribe(() => {
        this.goalProtein = Math.round(this.proteinManual);
        this.goalFat = Math.round(this.fatManual);
        this.goalCarbs = Math.round(this.carbsManual);
        this.closeCalcModal();
      });
    } else {
      forkJoin([
        this.userService.addUserSetting('goalProtein', Math.round(this.protein).toString()),
        this.userService.addUserSetting('goalFat', Math.round(this.fat).toString()),
        this.userService.addUserSetting('goalCarbs', Math.round(this.carbs).toString()),
      ]).subscribe(() => {
        this.goalProtein = Math.round(this.protein);
        this.goalFat = Math.round(this.fat);
        this.goalCarbs = Math.round(this.carbs);
        this.closeCalcModal();
      });
    }
  }

  private setMarkers() {
    this.markers = [
      { title: 'deficit', value: this.tdee - 200 },
      { title: 'baseline', value: this.tdee },
      { title: 'surplus', value: this.tdee + 200 },
    ];
  }

  private calcCalories(): void {
    this.calcTDEE();
    this.setMarkers();
    this.calories = this.tdee;
    this.calcCarbs();
  }

  private calcTDEE(): void { 
    const bmr = calculateTDEE(this.gender, this.weight, this.height, this.age);
    this.tdee = bmr * this.activity;
  }

  private calcCarbs(): void {
    this.carbs = (this.calories - this.protein * 4.0 - this.fat * 9.0) / 4.0;
  }

}
