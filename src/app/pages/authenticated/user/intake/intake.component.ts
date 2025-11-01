import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { Gender } from '../../../../shared/model/gender';
import { differenceInYears, parse } from 'date-fns';
import { forkJoin } from 'rxjs';
import { calculateTDEE } from 'src/app/util/functions';

import { ModalComponent } from '../../../../shared/components/modal/modal.component';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'ml-intake',
    templateUrl: './intake.component.html',
    imports: [ModalComponent, FormsModule]
})
export class IntakeComponent implements OnInit {
  public goalProtein: number;
  public goalFat: number;
  public goalCarbs: number;

  public protein: number;
  public fat: number;
  public carbs: number;
  public calories: number;

  public age: number;
  public birthday: string;
  public gender: Gender;
  public height: number;
  public weight: number;
  public activity: number;

  public showModal = false;

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
      this.calcTDEE();
    });
  }

  public openModal(): void {
    this.showModal = true;
    this.protein = this.goalProtein;
    this.fat = this.goalFat;
    this.carbs = this.goalCarbs;
    this.calcCalories();
  }

  public closeModal(): void {
    this.showModal = false;
  }

  public fillStandard() {
    this.calories = Math.round(this.tdee);
    this.protein = Math.round(this.weight * 1.8);
    this.fat = Math.round(this.weight * 0.8);
    this.calcCarbs();
  }

  public calcCalories(): void {
    this.calories = this.protein * 4 + this.fat * 9 + this.carbs * 4;
  }

  public saveIntake() {
    forkJoin([
      this.userService.addUserSetting('goalProtein', Math.round(this.protein).toString()),
      this.userService.addUserSetting('goalFat', Math.round(this.fat).toString()),
      this.userService.addUserSetting('goalCarbs', Math.round(this.carbs).toString()),
    ]).subscribe(() => {
      this.goalProtein = Math.round(this.protein);
      this.goalFat = Math.round(this.fat);
      this.goalCarbs = Math.round(this.carbs);
      this.closeModal();
    });
  }

  private calcTDEE(): void {
    const bmr = calculateTDEE(this.gender, this.weight, this.height, this.age);
    this.tdee = bmr * this.activity;
  }

  private calcCarbs(): void {
    this.carbs = Math.round((this.calories - this.protein * 4.0 - this.fat * 9.0) / 4.0);
  }

}
