import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  public menuOpen = false;

  constructor(private authService: AuthenticationService) {}

  ngOnInit() {}

  public toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }

  public isLoggedIn() {
    return this.authService.isAuthenticated();
  }
}
