import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
    selector: 'ml-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    imports: [RouterLink, NgIf]
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
