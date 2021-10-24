import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  public menuOpen = false;

  constructor(private readonly authService: AuthenticationService, private readonly router: Router) { }

  ngOnInit(): void {
  }

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
