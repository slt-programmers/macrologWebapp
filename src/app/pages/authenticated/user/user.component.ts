import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'ml-user-page',
    templateUrl: './user.component.html',
    styleUrls: ['./user.component.scss'],
    standalone: false
})
export class UserComponent {

	constructor(public router: Router) {}

}
