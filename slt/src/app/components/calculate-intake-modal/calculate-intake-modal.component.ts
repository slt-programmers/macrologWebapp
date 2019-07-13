import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Gender } from '../../model/gender';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';

@Component({
	selector: 'calculate-intake-modal',
	templateUrl: './calculate-intake-modal.component.html'
})
export class CalculateIntakeModalComponent implements OnInit {

	@Input() age: number;
	@Input() gender: Gender;
	@Input() height: number;
	@Input() weight: number;
	@Input() activity: number;

	@Input() currentProtein: number;
	@Input() currentFat: number;
	@Input() currentCarbs: number;

	public showCalories = false;
	public showMacros = false;
	public markers;

	public calories: number;

	public protein: number;
	public fat: number;
	public carbs: number;

	public proteinManual: number;
	public fatManual: number;
	public carbsManual: number;

	private bmr: number;
	private tdee: number;

	private goalProtein: string;
	private goalFat: string;
	private goalCarbs: string;

	@Output() close: EventEmitter<any> = new EventEmitter<any>();

	constructor(private userService: UserService) {
	}

	ngOnInit() {
		this.calories = (this.currentProtein * 4) + (this.currentFat * 9) +
			(this.currentCarbs * 4);
		this.proteinManual = this.currentProtein;
		this.fatManual = this.currentFat;
		this.carbsManual = this.currentCarbs;
	}

	public showCaloriesTab() {
		this.protein = this.weight * 1.8;
		this.fat = this.weight * 0.8;
		this.calcCalories();
		this.showCalories = true;
		this.showMacros = false;
	}

	public showMacrosTab() {
		this.calories = (this.currentProtein * 4) + (this.currentFat * 9) +
			(this.currentCarbs * 4);
		this.showCalories = false;
		this.showMacros = true;
	}


	public closeModal() {
		this.close.emit({goalProtein: this.goalProtein,
			goalFat: this.goalFat, goalCarbs: this.goalCarbs
		});
	}

	private setMarkers() {
		this.markers = [
			{title: 'deficit', value: (this.tdee - 200)},
			{title: 'baseline', value: (this.tdee)},
			{title: 'surplus', value: (this.tdee + 200)}
		];
	}

	public changeCalories(event) {
		this.calories = event;
		this.calcCarbs();
	}

	private calcCalories(): void {
		this.calcTDEE();
		this.setMarkers();
		this.calories = this.tdee;
		this.calcCarbs();
	}

	public calcCaloriesManual(): void {
		this.calories = (this.proteinManual * 4) + (this.fatManual * 9) + (this.carbsManual * 4);
	}

	private calcTDEE(): void {
		let bmr;
		if (this.gender === 'MALE') {
			bmr = 66.5 + (13.7 * this.weight) + (5 * this.height) - (6.76 * this.age);
		} else {
			bmr = 655.0 + (9.56 * this.weight) + (1.8 * this.height) - (4.68 * this.age);
		}
		this.tdee = bmr * this.activity;
	}

	private calcCarbs(): void {
		this.carbs = (this.calories - (this.protein * 4.0) - (this.fat * 9.0)) / 4.0;
	}

	public saveIntake() {
		if (this.showMacros) {
			forkJoin(
				this.userService.addUserInfo('goalProtein', Math.round(this.proteinManual).toString()),
				this.userService.addUserInfo('goalFat', Math.round(this.fatManual).toString()),
				this.userService.addUserInfo('goalCarbs', Math.round(this.carbsManual).toString())
			).subscribe(
					data => {
						this.goalProtein = Math.round(this.proteinManual).toString();
						this.goalFat = Math.round(this.fatManual).toString();
						this.goalCarbs = Math.round(this.carbsManual).toString();
					},
					error => console.error(error),
					() => { this.closeModal(); }
			);
		} else {
			forkJoin(
				this.userService.addUserInfo('goalProtein', Math.round(this.protein).toString()),
				this.userService.addUserInfo('goalFat', Math.round(this.fat).toString()),
				this.userService.addUserInfo('goalCarbs', Math.round(this.carbs).toString())
			).subscribe(
					data => {
						this.goalProtein = Math.round(this.protein).toString();
						this.goalFat = Math.round(this.fat).toString();
						this.goalCarbs = Math.round(this.carbs).toString();
					},
					error => console.error(error),
					() => this.closeModal()
			);
		}
	}



}