import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Gender } from '../../model/gender';
import { ToastService } from '../../services/toast.service';

@Component({
	selector: 'user-page',
	templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

	public name: string;
	public birthday: number;
	public gender: Gender;
	public height: number;
	public weight: number;
	public activity: number;


	public goalProtein: string;
	public goalFat: string;
	public goalCarbs: string;

	public weighingDate: Date;
	public newWeight: number;

	constructor(private userService: UserService,
		private toastService: ToastService,
		public router: Router) {
	}

	ngOnInit() {
		this.userService.getAllSettings().subscribe(
			result => {
				this.name = this.getKeyFromResultlist(result, 'name');
				this.birthday = this.getKeyFromResultlist(result, 'birthday');
				this.gender = this.getKeyFromResultlist(result, 'gender') || Gender.Male;
				this.height = parseInt(this.getKeyFromResultlist(result, 'height'), 10) || undefined;
				this.weight = parseInt(this.getKeyFromResultlist(result, 'currentWeight'), 10) || undefined;
				this.activity = parseFloat(this.getKeyFromResultlist(result, 'activity')) || 1.2;
				this.newWeight = this.weight;
			},
			error => { console.log(error); }
		);
	}

	public saveNewWeight(): void {
		this.userService.saveWeight(this.weighingDate, this.newWeight).
			subscribe(
				data => this.toastService.setMessage('Your new weight is saved'),
				error => console.error(error)
			);
	}

	private getKeyFromResultlist(userSettingsDto: any, key: string) {

		if (userSettingsDto[key]) {
			return userSettingsDto[key];
		}
		return '';
	}

	// DEVTOOLS
	public exportData() {
		this.userService.getExport().subscribe(
			data => this.downloadFile(data),
			error => console.log(error)
		);
	}

	public importData(event) {

	}

	public downloadFile(data) {
		const blob = new Blob([JSON.stringify(data)], { type: 'text/json' });
		const url = window.URL.createObjectURL(blob);
		window.open(url);
	}
}
