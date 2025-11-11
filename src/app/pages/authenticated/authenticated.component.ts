import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ScrollBehaviourService } from '../../shared/services/scroll-behaviour.service';
import { AuthenticationService } from '../../shared/services/auth.service';
import { HealthcheckService } from 'src/app/shared/services/healthcheck.service';
import { foodActions } from 'src/app/shared/store/actions/food.actions';
import { Store } from '@ngrx/store';
import { dishesActions } from 'src/app/shared/store/actions/dishes.actions';

import { NavigationComponent } from '../../shared/components/navigation/navigation.component';

@Component({
    selector: 'ml-authenticated',
    templateUrl: './authenticated.component.html',
    imports: [NavigationComponent, RouterOutlet]
})
export class AuthenticatedComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly healthcheckService = inject(HealthcheckService);
  private readonly authService = inject(AuthenticationService);
  private readonly store = inject(Store);
  private readonly scrollBehaviourService = inject(ScrollBehaviourService);


  public smallMenuOpen = false;

  private asleep = true;

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
    this.store.dispatch(dishesActions.get())
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
