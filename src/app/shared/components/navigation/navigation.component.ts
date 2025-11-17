import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthenticationStore } from "../../store/auth.store";

@Component({
	selector: "ml-navigation",
	templateUrl: "./navigation.component.html",
	styleUrls: ["./navigation.component.css"],
	imports: [RouterLink],
})
export class NavigationComponent {
	private readonly authStore = inject(AuthenticationStore);
	private readonly router = inject(Router);

	isLoggedIn = this.authStore.isAuthenticated;
	isAdmin = this.authStore.isAdmin;
	menuOpen = false;

	toggleMenu(): void {
		this.menuOpen = !this.menuOpen;
	}

	logOut(): void {
		this.authStore.logout();
		this.router.navigate([""]);
	}
}
