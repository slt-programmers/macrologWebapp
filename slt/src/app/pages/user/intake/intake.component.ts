import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Gender } from '../../../model/gender';
import * as moment from 'moment';

@Component({
	selector: 'intake',
	templateUrl: './intake.component.html'
})
export class IntakeComponent {

	public goalProtein: number;
	public goalFat: number;
	public goalCarbs: number;

	private age: number;
	private birthday: string;
	private gender: Gender;
	private height: number;
	private weight: number;
	private activity: number;

	public showCalcModal = false;

	constructor(private userService: UserService) {
		this.userService.getUserSettings().subscribe(
			result => {
				// FOR CALC MODAL
				this.birthday = result.birthday;
				this.gender = result.gender || Gender.Male;
				this.height = result.height;
				this.weight = result.currentWeight;
				this.activity = result.activity;

				this.goalProtein = result.goalProtein;
				this.goalFat = result.goalFat;
				this.goalCarbs = result.goalCarbs;

				const birthdayDate = moment(this.birthday, 'YYYY-M-D', true);
				this.age = moment().diff(birthdayDate, 'years');
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
