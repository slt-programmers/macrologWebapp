import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Gender } from '../../../model/gender';
import * as moment from 'moment';

@Component({
	selector: 'user-intake',
	templateUrl: './user.intake.component.html'
})
export class UserIntakeComponent {

	public goalProtein: string;
	public goalFat: string;
	public goalCarbs: string;

	private age;
	private birthday;
	private gender;
	private height;
	private weight;
	private activity;

	public showCalcModal = false;

	constructor(private userService: UserService) {
		this.userService.getAllSettings().subscribe(
			result => {
				// FOR CALC MODAL
				this.birthday = this.getKeyFromResultlist(result, 'birthday');
				this.gender = this.getKeyFromResultlist(result, 'gender') || Gender.Male;
				this.height = parseInt(this.getKeyFromResultlist(result, 'height'), 10) || undefined;
				this.weight = parseInt(this.getKeyFromResultlist(result, 'currentWeight'), 10) || undefined;
				this.activity = parseFloat(this.getKeyFromResultlist(result, 'activity')) || 1.2;

				this.goalProtein = this.getKeyFromResultlist(result, 'goalProtein');
				this.goalFat = this.getKeyFromResultlist(result, 'goalFat');
				this.goalCarbs = this.getKeyFromResultlist(result, 'goalCarbs');

				// derived age:
				const birthdayDate = moment(this.birthday, 'YYYY-M-D', true);
				if (birthdayDate.isValid()) {
					this.age = moment().diff(birthdayDate, 'years');
				} else {
					// indien age opgevoerd in verleden
					this.age = parseInt(this.getKeyFromResultlist(result, 'age'), 10) || undefined;
				}
			});
	}

	public openCalcModal(): void {
		this.showCalcModal = true;
	}

	public closeCalcModal(event): void {
		this.goalProtein = event.goalProtein ? event.goalProtein : this.goalProtein;
		this.goalFat = event.goalFat ? event.goalFat : this.goalFat;
		this.goalCarbs = event.goalCarbs ? event.goalCarbs : this.goalCarbs;
		this.showCalcModal = false;
	}

	private getKeyFromResultlist(userSettingsDto: any, key: string) {
		if (userSettingsDto[key]) {
			return userSettingsDto[key];
		}
		return '';
	}
}
