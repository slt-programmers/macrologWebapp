import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

	constructor(public auth: AuthenticationService, public router: Router) { }

	canActivate(): boolean {
		console.log('CAN ACTIVATE');
		if (!this.auth.isAuthenticated()) {
			this.router.navigate(['/']);
			console.log('NOE');
			return false;
		}
		console.log('YAASS');
		return true;
	}
}
