import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from './auth.service';

@Injectable()
export class GuestGuard implements CanActivate {
  constructor(public auth: AuthenticationService, public router: Router) {}

  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/log']);
      return false;
    }
    return true;
  }
}
