import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationStore } from 'src/app/shared/store/auth.store';

@Injectable()
export class AuthGuard  {
  private readonly auth = inject(AuthenticationStore);
  private readonly router = inject(Router);

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
