import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
    selector: 'ml-user-page',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    imports: [NgClass, RouterLink, RouterOutlet]
})
export class UserComponent {

	constructor(public router: Router) {}

}
