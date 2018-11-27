import { Component } from '@angular/core';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { UserService } from '../../../services/user.service';
import { Gender } from '../../../model/gender';
import { ToastService } from '../../../services/toast.service';

@Component({
	selector: 'user-personal',
	templateUrl: './user.personal.component.html'
})
export class UserPersonalComponent {

	private originalResult;

	public name;
	public age;
	public gender;
	public height;
	public weight;
	public activity;

	public newWeight;

	constructor(private userService: UserService,
							private toastService: ToastService) {
		this.userService.getAllSettings().subscribe(
			result => {
				this.originalResult = result;
				this.name = this.getKeyFromResultlist(result, 'name');
				this.age = parseInt(this.getKeyFromResultlist(result, 'age'), 10) || undefined ;
				this.gender = this.getKeyFromResultlist(result, 'gender') || Gender.Male;
				this.height = parseInt(this.getKeyFromResultlist(result, 'height'), 10) || undefined;
				this.weight = parseInt(this.getKeyFromResultlist(result, 'weight'), 10) || undefined;
				this.activity = parseFloat(this.getKeyFromResultlist(result, 'activity')) || 1.2;

				this.newWeight = this.weight;
			},
			error => { console.log(error); }
		);
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
				data => this.toastService.setMessage('Your data is saved!'),
				error => console.error(error)
		);
	}

	public isInputUnchanged(): boolean {
		if (this.originalResult !== undefined) {
			if (this.name === this.getKeyFromResultlist(this.originalResult, 'name')
					&& this.age === parseInt(this.getKeyFromResultlist(this.originalResult, 'age'), 10)
					&& this.gender === this.getKeyFromResultlist(this.originalResult, 'gender')
					&& this.height === parseInt(this.getKeyFromResultlist(this.originalResult, 'height'), 10)
					&& this.weight === parseInt(this.getKeyFromResultlist(this.originalResult, 'weight'), 10)
					&& this.activity.toString() === this.getKeyFromResultlist(this.originalResult, 'activity')
					) {
				return true;
			}
		}
		return false;
	}

	private getKeyFromResultlist(list: any, key: string) {
		for (const item of list) {
			if (item.name === key) {
				return item.value;
			}
		}
		return '';
	}
}
