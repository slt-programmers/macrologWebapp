import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@app/services/auth.service';

@Component({
  selector: 'home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  public menuToggle = false;

  constructor(private authService: AuthenticationService) { }

  ngOnInit() {
  }

  public toggleMenu() {
    console.log('Toggle')
    this.menuToggle = !this.menuToggle;
  }

  public isLoggedIn() {
    return this.authService.isAuthenticated();
  }
}
