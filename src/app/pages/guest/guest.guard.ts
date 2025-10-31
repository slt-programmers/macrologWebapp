import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../shared/services/auth.service';

@Injectable()
export class GuestGuard  {
  constructor(public auth: AuthenticationService, public router: Router) {}

  canActivate(): boolean {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['dashboard']);
      return false;
    }
    return true;
  }
}
