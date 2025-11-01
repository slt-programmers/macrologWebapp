import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgIf, NgClass } from '@angular/common';

@Component({
    selector: 'ml-admin-page',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    imports: [NgIf, NgClass, RouterLink, RouterOutlet]
})
export class AdminComponent {

	constructor(public router: Router) {}

  public isAdmin(): boolean {
		const currentUser = JSON.parse(localStorage.getItem('currentUser'));
		return (currentUser && currentUser.admin);
	}
}
