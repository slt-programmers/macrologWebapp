import { signal } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { provideRouter, Router, RouterOutlet } from "@angular/router";
import { MockComponent, MockProvider } from "ng-mocks";
import { NavigationComponent } from "src/app/shared/components/navigation/navigation.component";
import { AuthenticationStore } from "src/app/shared/store/auth.store";
import { HealthcheckService } from "../../shared/services/healthcheck.service";
import { ScrollBehaviourService } from "../../shared/services/scroll-behaviour.service";
import { AuthenticatedComponent } from "./authenticated.component";

describe("AuthenticatedComponent", () => {
	let component: AuthenticatedComponent;
	let fixture: ComponentFixture<AuthenticatedComponent>;
	let scrollBehaviourService: ScrollBehaviourService;
	let authStore: any;
	let router: Router;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				RouterOutlet,
				AuthenticatedComponent,
				MockComponent(NavigationComponent),
			],
			providers: [
				provideRouter([]),
				MockProvider(HealthcheckService),
				MockProvider(ScrollBehaviourService),
				MockProvider(AuthenticationStore, {
					logout: () => {},
					isAdmin: signal(false),
				}),
			],
		}).compileComponents();

		fixture = TestBed.createComponent(AuthenticatedComponent);
		component = fixture.componentInstance;
		scrollBehaviourService = TestBed.inject(ScrollBehaviourService);
		authStore = TestBed.inject(AuthenticationStore);
		router = TestBed.inject(Router);
	});

	afterEach(() => {
		localStorage.clear();
	});

	it("should create authenticated component", () => {
		expect(component).toBeTruthy();
	});

	it("should init the app component", () => {
		const result = component.stillSleeping();
		expect(result).toBeFalsy();
	});

	it("should open menu", () => {
		spyOn(scrollBehaviourService, "preventScrolling");
		component.smallMenuOpen = false;
		component.openMenu();
		expect(component.smallMenuOpen).toBeTruthy();

		component.openMenu();
		expect(component.smallMenuOpen).toBeFalsy();
	});

	it("should close menu", () => {
		spyOn(scrollBehaviourService, "preventScrolling");
		component.smallMenuOpen = true;
		component.closeMenu();
		expect(component.smallMenuOpen).toBeFalsy();
	});

	it("should determine if admin", () => {
		let result = component.isAdmin();
		expect(result).toBeFalse();

		authStore.isAdmin.set(true);
		result = component.isAdmin();
		expect(result).toBeTrue();
	});

	it("should log user out", () => {
		spyOn(router, "navigate");
		spyOn(scrollBehaviourService, "preventScrolling");
		spyOn(authStore, "logout");
		component.smallMenuOpen = true;

		component.logOut();
		expect(router.navigate).toHaveBeenCalledWith([""]);
		expect(scrollBehaviourService.preventScrolling).toHaveBeenCalledWith(false);
		expect(authStore.logout).toHaveBeenCalled();
		expect(component.smallMenuOpen).toBeFalse();
	});
});
