import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from './auth.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(public auth: AuthenticationService, public router: Router) {}

	canActivate(): boolean {
		console.log('Am I allowed to navigate?');
		if (!this.auth.isAuthenticated()) {
			console.log('Not logged in');
			this.router.navigate(['login']);
			return false;
		}

		console.log('Logged in');
		return true;
	}

}
