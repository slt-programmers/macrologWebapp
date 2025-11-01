import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/auth.service';

@Component({
    selector: 'ml-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    standalone: false
})
export class NavigationComponent{

  public menuOpen = false;

  constructor(private readonly authService: AuthenticationService, private readonly router: Router) { }

  public toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  public logOut() {
    this.authService.logout();
    this.router.navigate(['']);
  }

  public isLoggedIn() {
    return this.authService.isAuthenticated();
  }

  public isAdmin() {
    return this.authService.isAdmin();
  }

}
