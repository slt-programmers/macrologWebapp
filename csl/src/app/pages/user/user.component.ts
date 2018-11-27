import { Component, OnInit, OnChanges, SimpleChanges, Input } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Gender } from '../../model/gender';
import { Observable } from 'rxjs/Observable';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ToastService } from '../../services/toast.service';

@Component({
	selector: 'user-page',
	templateUrl: './user.component.html'
})
export class UserComponent implements OnInit {

	public name: string;
	public age: number;
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
		console.log('Init settings');
		this.userService.getAllSettings().subscribe(
			result => {
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

	public saveNewWeight(): void {
		this.userService.saveWeight(this.weighingDate, this.newWeight).
			subscribe(
				data => this.toastService.setMessage('Your new weight is saved'),
				error => console.error(error)
			);
	}

	private getKeyFromResultlist(list: any, key: string) {
		for (const item of list) {
			if (item.name === key) {
				return item.value;
			}
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
