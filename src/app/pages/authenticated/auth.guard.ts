import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../shared/services/auth.service';

@Injectable()
export class AuthGuard  {
  auth = inject(AuthenticationService);
  router = inject(Router);


  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
