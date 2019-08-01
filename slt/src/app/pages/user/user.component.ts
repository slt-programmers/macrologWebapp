import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { Gender } from '../../model/gender';
import { ToastService } from '../../services/toast.service';

@Component({
	selector: 'user-page',
	templateUrl: './user.component.html'
})
export class UserComponent {

	constructor(public router: Router) {}

	// DEVTOOLS
	// public exportData() {
	// 	this.userService.getExport().subscribe(
	// 		data => this.downloadFile(data),
	// 		error => console.log(error)
	// 	);
	// }

	// public importData(event) {
	// }

	// public downloadFile(data) {
	// 	const blob = new Blob([JSON.stringify(data)], { type: 'text/json' });
	// 	const url = window.URL.createObjectURL(blob);
	// 	window.open(url);
	// }
}
