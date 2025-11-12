import { ComponentFixture, TestBed } from "@angular/core/testing";
import {
	provideRouter,
	Router,
	RouterLink,
	RouterOutlet,
} from "@angular/router";
import { MockProvider } from "node_modules/ng-mocks";
import { AuthenticationStore } from "../../store/auth.store";
import { NavigationComponent } from "./navigation.component";
import { signal } from "@angular/core";

describe("NavigationComponent", () => {
	let component: NavigationComponent;
	let fixture: ComponentFixture<NavigationComponent>;
	let authStore: any;
	let router: Router;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [RouterOutlet, RouterLink, NavigationComponent],
			providers: [
				provideRouter([]),
				MockProvider(AuthenticationStore, {
					logout: () => {},
					isAuthenticated: signal(true),
					isAdmin: signal(true),
				}),
			],
		}).compileComponents();

		authStore = TestBed.inject(AuthenticationStore);
		router = TestBed.inject(Router);
		fixture = TestBed.createComponent(NavigationComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it("should create", () => {
		expect(component).toBeTruthy();
	});

	it("should toggle menu", () => {
		expect(component.menuOpen).toBeFalse();
		component.toggleMenu();
		expect(component.menuOpen).toBeTrue();
	});

	it("should log out", () => {
		spyOn(authStore, "logout");
		spyOn(router, "navigate");
		component.logOut();
		expect(authStore.logout).toHaveBeenCalled();
		expect(router.navigate).toHaveBeenCalledWith([""]);
	});

	it("should return admin", () => {
		spyOn(authStore, "isAdmin").and.returnValue(true);
		expect(component.isAdmin()).toBeTrue();
	});
});
