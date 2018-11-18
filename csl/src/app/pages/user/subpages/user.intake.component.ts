import {Component }from '@angular/core';
import {Subscription} from 'rxjs';

import {UserService} from '../../../services/user.service';
import {Gender} from '../../../model/gender';

@Component({
  selector: 'userIntake',
  templateUrl: './user.intake.component.html'
})
export class UserIntakeComponent {

	public goalProtein: string;
	public goalFat: string;
	public goalCarbs: string;

	public age;
	public gender;
	public height;
	public weight;
	public activity;

	public showCalcModal: boolean = false;

	constructor(private userService: UserService) {
		this.userService.getAllSettings().subscribe(
			result => {

				// FOR CALC MODAL
				this.age = parseInt(this.getKeyFromResultlist(result, 'age')) || undefined ;
				this.gender = this.getKeyFromResultlist(result, 'gender') || Gender.Male;
				this.height = parseInt(this.getKeyFromResultlist(result, 'height')) || undefined;
				this.weight = parseInt(this.getKeyFromResultlist(result, 'weight')) || undefined;
				this.activity = parseFloat(this.getKeyFromResultlist(result, 'activity')) || 1.2;

				this.goalProtein = this.getKeyFromResultlist(result, 'goalProtein');
				this.goalFat = this.getKeyFromResultlist(result, 'goalFat');
				this.goalCarbs = this.getKeyFromResultlist(result, 'goalCarbs');
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

	private getKeyFromResultlist(list: any, key: string) {
		for (let item of list) {
			if (item.name === key) {
				return item.value;
			}
		}
		return '';
	}

}