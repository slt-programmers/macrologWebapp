import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
    selector: 'ml-admin-page',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss'],
    imports: [NgClass, RouterLink, RouterOutlet]
})
export class AdminComponent {
	router = inject(Router);


  public isAdmin(): boolean {
		const currentUser = JSON.parse(localStorage.getItem('currentUser') || '');
		return (currentUser && currentUser.admin);
	}
}
