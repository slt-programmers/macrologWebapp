import{Component, OnInit}from '@angular/core';

@Component({
  selector: 'account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {

	public name: string;
	public age: number;
	public gender: string;
	public height: number;

	public showCalcModal: boolean = false;

	public weight: number;
	public activity: number;
	public difference: string;

	private bmr: number;
	private tdee: number;

	public protein: number;
	public fat: number;
	public carbs: number;
	public calories: number;

  constructor() {
		this.name = 'John Doe';
		this.age = 35;
		this.gender = 'male';
		this.height = 170;

		this.weight = 75.0;
		this.activity = 1.2;
		this.difference = 'same';

		this.protein;
		this.fat;
		this.carbs = 240;
	}

  ngOnInit() {
	}

	openCalcModal(): void {
		this.showCalcModal = true;
		this.calcCalories();
		this.protein = this.weight * 1.8;
		this.fat = this.weight * 0.8;
	}

	closeCalcModal(close: boolean): void {
		this.showCalcModal = !close;
	}

	calcCalories(): void {
		this.calcBMR();
		this.calcTDEE();
		this.calories = this.tdee;

#		this.calcCarbs();
#		this.calories = (this.protein * 4) + (this.fat * 9) + (this.carbs * 4);
	}

	addOne(): void {
		this.calories = this.calories + 1;
	}

	subtractOne(): void {
		this.calories = this.calories -1;
	}

	adjustDiff(): void {
		this.calcCalories();
		if (this.difference === 'lose') {
			this.calories = this.calories - 200;
		} else if (this.difference === 'gain') {
			this.calories = this.calories + 200;
		}
	}

	calcBMR(): void {
		if (this.gender === 'male') {
			this.bmr = 66.5 + (13.7 * this.weight) + (5 * this.height) - (6.76 * this.age);
		} else {
			this.bmr = 655.0 + (9.56 * this.weight) + (1.8 * this.height) - (4.68 * this.age);
		}
	}

	calcTDEE(): void {
		this.tdee = this.bmr * this.activity;
	}

	calcCarbs(): void {
		this.carbs = (this.tdee - (this.protein * 4.0) - (this.fat * 9.0)) / 4.0;
	}
}
