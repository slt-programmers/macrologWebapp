import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ScrollBehaviourService } from '../../shared/services/scroll-behaviour.service';
import { AuthenticationService } from '../../shared/services/auth.service';
import { HealthcheckService } from 'src/app/shared/services/healthcheck.service';
import { foodActions } from 'src/app/shared/store/actions/food.actions';
import { State } from 'src/app/shared/store/reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'ml-authenticated',
  templateUrl: './authenticated.component.html'
})
export class AuthenticatedComponent implements OnInit {

  public smallMenuOpen = false;

  private asleep = true;

  constructor(
    private readonly router: Router,
    private readonly healthcheckService: HealthcheckService,
    private readonly authService: AuthenticationService,
    private readonly store: Store,
    private readonly scrollBehaviourService: ScrollBehaviourService
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
    this.store.dispatch(foodActions.get());
  }

  public stillSleeping(): boolean {
    return this.asleep;
  }

  public openMenu() {
    this.smallMenuOpen = !this.smallMenuOpen;
    if (this.smallMenuOpen) {
      this.scrollBehaviourService.preventScrolling(true);
    }
  }

  public closeMenu() {
    this.smallMenuOpen = false;
    this.scrollBehaviourService.preventScrolling(false);
  }

  public isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  public logOut() {
    this.smallMenuOpen = false;
    this.scrollBehaviourService.preventScrolling(false);
    this.authService.logout();
    this.router.navigate(['']);
  }
}
