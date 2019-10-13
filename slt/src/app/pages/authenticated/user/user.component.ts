import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'user-page',
	templateUrl: './user.component.html',
	styleUrls:['./user.component.scss']
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
