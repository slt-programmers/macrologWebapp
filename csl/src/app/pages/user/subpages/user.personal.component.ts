import {Component, OnInit }from '@angular/core';
import {forkJoin} from 'rxjs/observable/forkJoin';

import {UserService} from '../../../services/user.service';
import {Gender} from '../../../model/gender';
import {ToastService} from '../../../services/toast.service';

@Component({
  selector: 'userPersonal',
  templateUrl: './user.personal.component.html'
})
export class UserPersonalComponent implements OnInit {

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
				this.name = this.getKeyFromResultlist(result, 'name');
				this.age = parseInt(this.getKeyFromResultlist(result, 'age')) || undefined ;
				this.gender = this.getKeyFromResultlist(result, 'gender') || Gender.Male;
				this.height = parseInt(this.getKeyFromResultlist(result, 'height')) || undefined;
				this.weight = parseInt(this.getKeyFromResultlist(result, 'weight')) || undefined;
				this.activity = parseFloat(this.getKeyFromResultlist(result, 'activity')) || 1.2;

				this.newWeight = this.weight;
			},
			error => { console.log(error) }
		);
	}

	ngOnInit() {

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

	private getKeyFromResultlist(list: any, key: string) {
		for (let item of list) {
			if (item.name === key) {
				return item.value;
			}
		}
		return '';
	}

}