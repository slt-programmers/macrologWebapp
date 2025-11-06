import { Component, OnInit, inject } from '@angular/core';
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
  private userService = inject(UserService);

  public goalProtein = 0
  public goalFat = 0
  public goalCarbs = 0

  public protein = 0;
  public fat = 0;
  public carbs = 0;
  public calories = 0;

  public age = 18;
  public birthday?: string;
  public gender = Gender.Male;
  public height = 0;
  public weight = 0;
  public activity = 1.2; // TODO make enum

  public showModal = false;

  private tdee = 0;

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
