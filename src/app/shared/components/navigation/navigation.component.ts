import { Component, inject } from "@angular/core";
import { Router, RouterLink } from "@angular/router";
import { AuthenticationService } from "../../services/auth.service";

@Component({
	selector: "ml-navigation",
	templateUrl: "./navigation.component.html",
	styleUrls: ["./navigation.component.css"],
	imports: [RouterLink],
})
export class NavigationComponent {
	private readonly authService = inject(AuthenticationService);
	private readonly router = inject(Router);

	menuOpen = false;

	toggleMenu(): void {
		this.menuOpen = !this.menuOpen;
	}

	logOut(): void {
		this.authService.logout();
		this.router.navigate([""]);
	}

	isLoggedIn(): boolean {
		return this.authService.isAuthenticated();
	}

	isAdmin(): boolean {
		return this.authService.isAdmin();
	}
}
