import {Component, OnInit, OnChanges, SimpleChanges, Input }from '@angular/core';
import {UserService} from '../../services/user.service';

import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';

export enum Gender {
	Male = 'MALE',
	Female = 'FEMALE'
}

@Component({
  selector: 'user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

	public name: string;
	public age: number;
	public gender: Gender;
	public height: number;
	public weight: number;
	public activity: number;

	public showCalcModal: boolean = false;
	public showMoreOptions: boolean = false;
	public difference: string;
	public markers;

	private bmr: number;
	private tdee: number;

	public protein: number;
	public fat: number;
	public carbs: number;

	public proteinManual: number;
	public fatManual: number;
	public carbsManual: number;

	public goalProtein: string;
	public goalFat: string;
	public goalCarbs: string;

	@Input() public calories: number;

  constructor(private userService: UserService) {
		this.difference = 'same';
		this.protein;
		this.fat;
		this.carbs;
	}

  ngOnInit() {
		this.userService.getAllSettings().subscribe(
			result => {
			 this.name = this.getKeyFromResultlist(result, 'name');
			 this.age = parseInt(this.getKeyFromResultlist(result, 'age')) || undefined ;
       this.gender = this.getKeyFromResultlist(result, 'gender') || Gender.Male;
			 this.height = parseInt(this.getKeyFromResultlist(result, 'height')) || undefined;
			 this.weight = parseInt(this.getKeyFromResultlist(result, 'weight')) || undefined;
			 this.activity = parseFloat(this.getKeyFromResultlist(result, 'activity')) || 1.2;
			 this.setGoalMacros(result);
			 },
			error => { console.log(error) }
		);
	}

	setGoalMacros(result) {
		this.goalProtein = this.getKeyFromResultlist(result, 'goalProtein');
		this.goalFat = this.getKeyFromResultlist(result, 'goalFat');
		this.goalCarbs = this.getKeyFromResultlist(result, 'goalCarbs');
	}

	setMarkers() {
		this.markers = [{title: 'deficit', value: (this.tdee - 200)},
		{title: 'baseline', value: (this.tdee)},
		{title: 'surplus', value: (this.tdee + 200)}];
	}

	openCalcModal(): void {
		this.protein = this.weight * 1.8;
		this.fat = this.weight * 0.8;
		this.calcCalories();
		this.showCalcModal = true;
	}

	closeCalcModal(close: boolean): void {
		this.showCalcModal = !close;
	}

	toggleOptions() {
		if (this.showMoreOptions) {
			this.calcCarbs();
		}
		this.proteinManual = Math.round(this.protein);
		this.fatManual = Math.round(this.fat);
		this.carbsManual = Math.round(this.carbs);
		this.showMoreOptions = !this.showMoreOptions;
	}

	changeCalories(event) {
		this.calories = event;
		this.calcCarbs();
	}

	calcCalories(): void {
		this.calcTDEE();
		this.setMarkers();
		this.calories = this.tdee;
		this.calcCarbs();
	}

	calcCaloriesManual(): void {
		this.calories = (this.proteinManual * 4) + (this.fatManual * 9) + (this.carbsManual * 4);
	}

	addOne(): void {
		if(this.calories < 4000) {
			this.calories = this.calories + 1;
		}
	}

	subtractOne(): void {
		if (this.calories > 1000) {
			this.calories = this.calories -1;
		}
	}

	adjustDiff(): void {
		this.calcCalories();
		if (this.difference === 'lose') {
			this.calories = this.calories - 200;
		} else if (this.difference === 'gain') {
			this.calories = this.calories + 200;
		}
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

	calcCarbs(): void {
		this.carbs = (this.calories - (this.protein * 4.0) - (this.fat * 9.0)) / 4.0;
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

//TODO: Toast melding voor het succesvol opslaan maken
        data => console.log(data),
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
          data => { this.goalProtein = Math.round(this.proteinManual).toString(),
              this.goalFat = Math.round(this.fatManual).toString(),
							this.goalCarbs = Math.round(this.carbsManual).toString()
           },
          error => console.error(error)
			);
		} else {
			forkJoin(
				this.userService.addUserInfo('goalProtein', Math.round(this.protein).toString()),
				this.userService.addUserInfo('goalFat', Math.round(this.fat).toString()),
				this.userService.addUserInfo('goalCarbs', Math.round(this.carbs).toString())
			).subscribe(
//TODO: Toast melding voor het succesvol opslaan maken
					data => { this.goalProtein = Math.round(this.protein).toString(),
              this.goalFat = Math.round(this.fat).toString(),
							this.goalCarbs = Math.round(this.carbs).toString()
           },
          error => console.error(error)
			);
		}
		this.closeCalcModal(true);
	}

	private getKeyFromResultlist(list: any, key: string) {
		for (let item of list) {
			if (item.name === key) {
				return item.value;
			}
		}
		return '';
	}

}
