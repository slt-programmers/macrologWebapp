import { Component, OnInit, inject } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { Store } from "@ngrx/store";
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
	private readonly authStore = inject(AuthenticationStore);
	private readonly store = inject(Store);
	private readonly scrollBehaviourService = inject(ScrollBehaviourService);

	private asleep = false;

	smallMenuOpen = false;
	isAdmin = this.authStore.isAdmin;

	ngOnInit() {
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

	public logOut() {
		this.smallMenuOpen = false;
		this.scrollBehaviourService.preventScrolling(false);
		this.authStore.logout();
		this.router.navigate([""]);
	}
}
