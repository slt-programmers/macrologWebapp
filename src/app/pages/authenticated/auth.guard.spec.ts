import { HttpClient } from "@angular/common/http";
import { signal } from "@angular/core";
import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";
import { MockProvider } from "ng-mocks";
import { AuthenticationStore } from "src/app/shared/store/auth.store";
import { AuthGuard } from "./auth.guard";

describe("AuthGuardService", () => {
	let authStore: any;
	let router: Router;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AuthGuard,
				provideRouter([]),
				MockProvider(AuthenticationStore, { isAuthenticated: signal(false) }),
				MockProvider(HttpClient),
			],
		});
		authStore = TestBed.inject(AuthenticationStore);
		router = TestBed.inject(Router);
	});

	it("should check if authorized to navigate", () => {
		const service = TestBed.inject(AuthGuard);
		spyOn(router, "navigate");

		let result = service.canActivate();
		expect(router.navigate).toHaveBeenCalledWith([""]);
		expect(result).toBeFalsy();

		authStore.isAuthenticated.set(true);
		result = service.canActivate();
		expect(result).toBeTruthy();
	});
});
