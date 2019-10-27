import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from './auth.service';

@Injectable()
export class GuestGuardService implements CanActivate {

	constructor(public auth: AuthenticationService, public router: Router) { }

	canActivate(): boolean {
		console.log('CAN ACTIVATE');
		if (this.auth.isAuthenticated()) {
			this.router.navigate(['/log']);
			console.log('NOPE');
			return false;
		}
		console.log('YES');
		return true;
	}
}
