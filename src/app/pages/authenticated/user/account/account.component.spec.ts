import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from "@angular/core";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { provideRouter } from "@angular/router";
import { MockProvider } from "ng-mocks";
import { AuthenticationStore } from "src/app/shared/store/auth.store";
import { AccountComponent } from "./account.component";

describe("AccountComponent", () => {
	let component: AccountComponent;
	let fixture: ComponentFixture<AccountComponent>;
	let authStore: any;

	beforeEach(() => {
		TestBed.configureTestingModule({
			imports: [FormsModule, AccountComponent],
			providers: [
				provideRouter([]),
				MockProvider(AuthenticationStore, {
					changePassword: () => {},
					deleteAccount: () => {},
				}),
			],
		}).compileComponents();

		authStore = TestBed.inject(AuthenticationStore);
		fixture = TestBed.createComponent(AccountComponent);
		component = fixture.componentInstance;
	});

	afterEach(() => {
		localStorage.clear();
	});

	it("should create account component", () => {
		expect(component).toBeTruthy();
	});

	it("should change password", () => {
		spyOn(authStore, "changePassword");
		component.changePassword();
		expect(authStore.changePassword as unknown).not.toHaveBeenCalled();

		component.form.patchValue({ oldPassword: "old", newPassword: "newpw" });
		component.changePassword();
		expect(component.form.valid).toBeFalsy();
		expect(authStore.changePassword as unknown).not.toHaveBeenCalled();

		component.form.patchValue({
			confirmPassword: "newpw",
		});
		expect(component.form.valid).toBeTruthy();
		component.changePassword();
		expect(authStore.changePassword as unknown).toHaveBeenCalled();
	});

	it("should delete account", () => {
		spyOn(authStore, "deleteAccount");
		component.password = "password";
		component.deleteAccount();
		expect(authStore.deleteAccount).toHaveBeenCalledWith("password");
	});
});
