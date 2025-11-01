import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthenticationService } from '../../services/auth.service';


@Component({
    selector: 'ml-navigation',
    templateUrl: './navigation.component.html',
    styleUrls: ['./navigation.component.scss'],
    imports: [RouterLink]
})
export class NavigationComponent{
  private readonly authService = inject(AuthenticationService);
  private readonly router = inject(Router);


  public menuOpen = false;

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
