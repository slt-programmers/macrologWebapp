import { Component, OnInit, inject } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { Store } from "@ngrx/store";
import { HealthcheckService } from "src/app/shared/services/healthcheck.service";
import { dishesActions } from "src/app/shared/store/actions/dishes.actions";
import { foodActions } from "src/app/shared/store/actions/food.actions";
import { ScrollBehaviourService } from "../../shared/services/scroll-behaviour.service";
import { AuthenticationStore } from "src/app/shared/store/auth.store";
import { NavigationComponent } from "../../shared/components/navigation/navigation.component";

@Component({
	selector: "ml-authenticated",
	templateUrl: "./authenticated.component.html",
	imports: [NavigationComponent, RouterOutlet],
})
export class AuthenticatedComponent implements OnInit {
	private readonly router = inject(Router);
	private readonly healthcheckService = inject(HealthcheckService);
	private readonly authStore = inject(AuthenticationStore);
	private readonly store = inject(Store);
	private readonly scrollBehaviourService = inject(ScrollBehaviourService);

	private asleep = true;

	smallMenuOpen = false;
	isAdmin = this.authStore.isAdmin;

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
		this.store.dispatch(dishesActions.get());
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

	public logOut() {
		this.smallMenuOpen = false;
		this.scrollBehaviourService.preventScrolling(false);
		this.authStore.logout();
		this.router.navigate([""]);
	}
}
