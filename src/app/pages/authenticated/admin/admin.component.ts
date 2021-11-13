import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
	selector: 'ml-admin-page',
	templateUrl: './admin.component.html',
	styleUrls:['./admin.component.scss']
})
export class AdminComponent {

	constructor(public router: Router) {}

  public isAdmin(): boolean {
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		return (currentUser && currentUser.admin);
	}
}
