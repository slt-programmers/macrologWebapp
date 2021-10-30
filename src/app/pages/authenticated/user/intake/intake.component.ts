import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../../shared/services/user.service';
import { Gender } from '../../../../shared/model/gender';
import { differenceInYears, parse } from 'date-fns';

@Component({
  selector: 'intake',
  templateUrl: './intake.component.html',
})
export class IntakeComponent implements OnInit {
  public goalProtein: number;
  public goalFat: number;
  public goalCarbs: number;

  public age: number;
  public birthday: string;
  public gender: Gender;
  public height: number;
  public weight: number;
  public activity: number;

  public showCalcModal = false;

  constructor(private userService: UserService) { }

  ngOnInit(): void {
    this.userService.getUserSettings().subscribe((result) => {
      // FOR CALC MODAL
      this.birthday = result.birthday;
      this.gender = result.gender || Gender.Male;
      this.height = result.height;
      this.weight = result.currentWeight;
      this.activity = result.activity;

      this.goalProtein = result.goalProtein;
      this.goalFat = result.goalFat;
      this.goalCarbs = result.goalCarbs;

      const birthdayDate = parse(this.birthday, 'yyy-MM-dd', new Date());
      this.age = differenceInYears(new Date(), birthdayDate);
    });
  }

  public openCalcModal(): void {
    this.showCalcModal = true;
  }

  public closeCalcModal(event: any): void {
    this.goalProtein = event.goalProtein ? event.goalProtein : this.goalProtein;
    this.goalFat = event.goalFat ? event.goalFat : this.goalFat;
    this.goalCarbs = event.goalCarbs ? event.goalCarbs : this.goalCarbs;
    this.showCalcModal = false;
  }
}
