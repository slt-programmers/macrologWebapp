import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { By } from "@angular/platform-browser";
import { provideRouter } from "@angular/router";
import { MockComponent, MockProvider } from "ng-mocks";
import { throwError } from "rxjs";
import { ModalComponent } from "src/app/shared/components/modal/modal.component";
import { NavigationComponent } from "src/app/shared/components/navigation/navigation.component";
import { AuthenticationStore } from "src/app/shared/store/auth.store";
import { LoginComponent } from "./login.component";
import { signal } from "@angular/core";

describe("LoginComponent", () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;
	let authStore: any;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [
				FormsModule,
				ReactiveFormsModule,
				LoginComponent,
				MockComponent(NavigationComponent),
				MockComponent(ModalComponent),
			],
			providers: [
				MockProvider(AuthenticationStore, {
					loginError: signal(""),
					registerError: signal(""),
					forgotEmailError: signal(""),
					login: () => {},
					register: () => {},
					resetPassword: () => {},
				}),
				provideRouter([]),
			],
		}).compileComponents();
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;
		authStore = TestBed.inject(AuthenticationStore);
		fixture.detectChanges();
	});

	it("should create component", () => {
		expect(component).toBeTruthy();
	});

	it("should log in", () => {
		spyOn(authStore, "login");
		component.login();
		expect(authStore.login).not.toHaveBeenCalled();

		component.loginForm.patchValue({
			usernameOrEmail: "username",
			password: "password",
		});
		component.login();
		expect(authStore.login).toHaveBeenCalledWith({
			usernameOrEmail: "username",
			password: "password",
		});
	});

	it("should register new user", () => {
		spyOn(authStore, "register");
		component.register();
		expect(authStore.register).not.toHaveBeenCalled();

		component.registerForm.patchValue({
			username: "name",
			email: "email@email.com",
			password: "secret",
		});
		component.register();
		expect(authStore.register).toHaveBeenCalled();
	});

	it("should toggle forgot password modal", () => {
		const forgotLink = fixture.debugElement.query(By.css("#forgotLink"));
		expect(component.showForgotPwModal()).toBeFalsy();
		forgotLink.nativeElement.click();
		fixture.detectChanges();
		expect(component.showForgotPwModal()).toBeTruthy();
	});

	it("should reset password", () => {
		const resetSpy = spyOn(authStore, "resetPassword");
		component.forgotEmail = "email@email.com";

		const forgotLink = fixture.debugElement.query(By.css("#forgotLink"));
		forgotLink.nativeElement.click();
		fixture.detectChanges();

		let resetBtn = fixture.debugElement.query(By.css("#resetBtn"));
		resetBtn.nativeElement.click();
		expect(resetSpy).toHaveBeenCalledWith("email@email.com");
		fixture.detectChanges();
		expect(component.showForgotPwModal()).toBeFalsy();

		resetSpy.and.returnValue(throwError({ status: 404 }));
		forgotLink.nativeElement.click();
		fixture.detectChanges();
		resetBtn = fixture.debugElement.query(By.css("#resetBtn"));
		resetBtn.nativeElement.click();
	});
});
