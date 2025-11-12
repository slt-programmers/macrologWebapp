import { TestBed } from "@angular/core/testing";
import { provideRouter, Router } from "@angular/router";
import { MockProvider } from "ng-mocks";
import { of, throwError } from "rxjs";
import { AuthenticationService } from "../services/auth.service";
import { ToastService } from "../services/toast.service";
import { AuthenticationStore } from "./auth.store";

describe("AuthenticationStore", () => {
	let store: any;
	let authService: AuthenticationService;
	let toastService: ToastService;
	let router: Router;

	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [
				AuthenticationStore,
				MockProvider(ToastService),
				MockProvider(AuthenticationService),
				provideRouter([]),
			],
		});

		toastService = TestBed.inject(ToastService);
		authService = TestBed.inject(AuthenticationService);
		router = TestBed.inject(Router);
	});

	it("should get local storage user", () => {
		localStorage.setItem(
			"currentUser",
			JSON.stringify({ userName: "carmen", admin: true })
		);

		store = TestBed.inject(AuthenticationStore);
		expect(store.isAuthenticated()).toBeTrue();
		expect(store.isAdmin()).toBeTrue();
	});

	it("should log in", () => {
		spyOn(router, "navigate");
		spyOn(authService, "login").and.returnValue(
			of({
				id: 1,
				userName: "carmen",
				email: "e@t.com",
				token: "token",
				admin: false,
			})
		);
		store = TestBed.inject(AuthenticationStore);
		store.login("username", "password");
		expect(router.navigate).toHaveBeenCalledWith(["dashboard"]);
	});

	it("should handle log in error", () => {
		spyOn(router, "navigate");
		spyOn(authService, "login").and.returnValue(
			throwError(() => ({ status: 401 }))
		);
		store = TestBed.inject(AuthenticationStore);
		store.login("username", "password");
		expect(router.navigate).not.toHaveBeenCalledWith(["dashboard"]);
		expect(store.loginError()).toEqual("Username or password incorrect");
	});

	it("should register", () => {
		spyOn(router, "navigate");
		spyOn(authService, "register").and.returnValue(
			of({
				id: 1,
				userName: "carmen",
				email: "e@t.com",
				token: "token",
				admin: false,
			})
		);
		spyOn(authService, "login").and.returnValue(
			of({
				id: 1,
				userName: "carmen",
				email: "e@t.com",
				token: "token",
				admin: false,
			})
		);
		store = TestBed.inject(AuthenticationStore);
		store.register({
			username: "username",
			email: "email",
			password: "password",
		});
		expect(router.navigate).toHaveBeenCalledWith(["dashboard", "onboarding"]);
	});

	it("should handle register error", () => {
		spyOn(router, "navigate");
		spyOn(authService, "register").and.returnValue(
			throwError(() => ({ status: 401 }))
		);
		store = TestBed.inject(AuthenticationStore);
		store.register({
			username: "username",
			email: "email",
			password: "password",
		});
		expect(router.navigate).not.toHaveBeenCalledWith([
			"dashboard",
			"onboarding",
		]);
		expect(store.registerError()).toEqual("Username or email already in use");
	});

	it("should handle register error on login", () => {
		spyOn(router, "navigate");
		spyOn(authService, "register").and.returnValue(
			of({
				id: 1,
				userName: "carmen",
				email: "e@t.com",
				token: "token",
				admin: false,
			})
		);
		spyOn(authService, "login").and.returnValue(
			throwError(() => ({ message: "Something weird went wrong" }))
		);
		store = TestBed.inject(AuthenticationStore);
		store.register({
			username: "username",
			email: "email",
			password: "password",
		});
		expect(router.navigate).not.toHaveBeenCalledWith([
			"dashboard",
			"onboarding",
		]);
		expect(store.loginError()).toEqual("Something weird went wrong");
	});

	it("should delete account", () => {
		spyOn(router, "navigate");
		spyOn(authService, "deleteAccount").and.returnValue(of(undefined));
		localStorage.setItem(
			"currentUser",
			JSON.stringify({ userName: "carmen", admin: true })
		);

		store = TestBed.inject(AuthenticationStore);
		store.deleteAccount("password");
		expect(router.navigate).toHaveBeenCalledWith(["/"]);
		expect(localStorage.getItem("currentUser")).toBeNull();
	});

	it("should handle error on delete account", () => {
		spyOn(router, "navigate");
		spyOn(authService, "deleteAccount").and.returnValue(
			throwError(() => ({ status: 401 }))
		);
		localStorage.setItem(
			"currentUser",
			JSON.stringify({ userName: "carmen", admin: true })
		);

		store = TestBed.inject(AuthenticationStore);
		store.deleteAccount("password");
		expect(router.navigate).not.toHaveBeenCalledWith(["/"]);
		expect(store.deleteError()).toEqual("Password incorrect");
		expect(localStorage.getItem("currentUser")).not.toBeNull();
	});

	it("should change password", () => {
		spyOn(authService, "changePassword").and.returnValue(of(undefined));
		spyOn(toastService, "setMessage");
		store = TestBed.inject(AuthenticationStore);

		store.changePassword({
			oldPassword: "pw",
			newPassword: "newpw",
			confirmPassword: "newpw",
		});

		expect(toastService.setMessage).toHaveBeenCalledWith(
			"Your password has changed",
			false,
			"Success!"
		);
	});

	it("should handle error on change password", () => {
		spyOn(authService, "changePassword").and.returnValue(
			throwError(() => ({}))
		);
		spyOn(toastService, "setMessage");
		store = TestBed.inject(AuthenticationStore);

		store.changePassword({
			oldPassword: "pw",
			newPassword: "newpw",
			confirmPassword: "newpw",
		});

		expect(toastService.setMessage).not.toHaveBeenCalledWith(
			"Your password has changed",
			false,
			"Success!"
		);
		expect(store.changePasswordError()).toEqual("Password invalid");
	});

	it("should reset password", () => {
		spyOn(authService, "resetPassword").and.returnValue(of(undefined));
		spyOn(toastService, "setMessage");
		store = TestBed.inject(AuthenticationStore);

		store.resetPassword("email@email.com");
		expect(toastService.setMessage).toHaveBeenCalledWith(
			"We have send an email to reset your password.",
			false,
			"Success!"
		);
	});

	it("should handle error on reset password", () => {
		spyOn(authService, "resetPassword").and.returnValue(throwError(() => ({})));
		spyOn(toastService, "setMessage");
		store = TestBed.inject(AuthenticationStore);

		store.resetPassword("email@email.com");
		expect(store.forgotEmailError()).toEqual("Emailadress was not found.");
		expect(toastService.setMessage).not.toHaveBeenCalledWith(
			"We have send an email to reset your password.",
			false,
			"Success!"
		);
	});

  it('shoud log out', () => {
    localStorage.setItem('currentUser', JSON.stringify({username: 'blaat'}));
    store = TestBed.inject(AuthenticationStore);
    expect(store.isAuthenticated()).toBeTrue();
    store.logout();
    expect(store.isAuthenticated()).toBeFalse();
    expect(localStorage.getItem('currentUser')).toBeNull();
  })
});
