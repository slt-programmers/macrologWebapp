import {
  provideHttpClient,
  withInterceptorsFromDi,
} from "@angular/common/http";
import { provideHttpClientTesting } from "@angular/common/http/testing";
import { signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";
import { MockProvider } from "ng-mocks";
import { AuthenticationStore } from "src/app/shared/store/auth.store";
import { GuestGuard } from "./guest.guard";

describe("GuestGuardService", () => {
	let service: GuestGuard;
	let authStore: any;
	let router: Router;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [],
			providers: [
				GuestGuard,
				provideRouter([]),
				provideHttpClient(withInterceptorsFromDi()),
				provideHttpClientTesting(),
				MockProvider(AuthenticationStore, { isAuthenticated: signal(false) }),
			],
		});
		service = TestBed.inject(GuestGuard);
		authStore = TestBed.inject(AuthenticationStore);
		router = TestBed.inject(Router);
	});

	it("should create service", () => {
		expect(service).toBeTruthy();
	});

	it("should check if guest", () => {
		spyOn(router, "navigate");
		authStore.isAuthenticated.set(true);
		let result = service.canActivate();
		expect(result).toBeFalsy();
		expect(router.navigate).toHaveBeenCalledWith(["dashboard"]);

		authStore.isAuthenticated.set(false);
		result = service.canActivate();
		expect(result).toBeTruthy();
	});
});
