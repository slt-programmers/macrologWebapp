import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {

  public menuOpen = false;

  constructor(private readonly authService: AuthenticationService) { }

  ngOnInit(): void {
  }

  public toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  public isLoggedIn() {
    return this.authService.isAuthenticated();
  }
}
