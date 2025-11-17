import { Component, inject } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { AuthenticationStore } from "src/app/shared/store/auth.store";
import { NavigationComponent } from "../../shared/components/navigation/navigation.component";
import { ScrollBehaviourService } from "../../shared/services/scroll-behaviour.service";

@Component({
	selector: "ml-authenticated",
	templateUrl: "./authenticated.component.html",
	imports: [NavigationComponent, RouterOutlet],
})
export class AuthenticatedComponent {
	private readonly router = inject(Router);
	private readonly authStore = inject(AuthenticationStore);
	private readonly scrollBehaviourService = inject(ScrollBehaviourService);

	private asleep = false;

	smallMenuOpen = false;
	isAdmin = this.authStore.isAdmin;

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
