import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollBehaviourService } from '../../shared/services/scroll-behaviour.service';
import { HealthcheckService } from '../../shared/services/healthcheck.service';
import { AuthenticationService } from '../../shared/services/auth.service';

@Component({
  selector: 'authenticated',
  templateUrl: './authenticated.component.html',
  styleUrls: ['./authenticated.component.scss'] 
})
export class AuthenticatedComponent implements OnInit {
  public moveState = 'forth';
  public moveDelayState = 'forth';
  public smallMenuOpen = false;

  private asleep = true;

  constructor(
    public router: Router,
    private healthcheckService: HealthcheckService,
    private authService: AuthenticationService,
    private sbs: ScrollBehaviourService
  ) {}

  ngOnInit() {
    this.healthcheckService.checkState().subscribe(
      (result) => {
        this.asleep = !result;
      },
      (error) => {
        if (error.status === 403) {
          this.asleep = !error;
        }
      }
    );
  }

  public stillSleeping(): boolean {
    return this.asleep;
  }

  public openMenu() {
    this.smallMenuOpen = !this.smallMenuOpen;
    if (this.smallMenuOpen) {
      this.sbs.preventScrolling(true);
    }
  }

  public closeMenu() {
    this.smallMenuOpen = false;
    this.sbs.preventScrolling(false);
  }

  public isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  public logOut() {
    this.smallMenuOpen = false;
    this.sbs.preventScrolling(false);
    this.authService.logout();
    this.router.navigate(['']);
  }
}
