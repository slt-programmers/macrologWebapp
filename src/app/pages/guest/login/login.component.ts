import { Component, inject, signal } from "@angular/core";
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { AuthenticationStore } from "src/app/shared/store/auth.store";
import { ModalComponent } from "../../../shared/components/modal/modal.component";
import { NavigationComponent } from "../../../shared/components/navigation/navigation.component";
import { AuthenticationService } from "../../../shared/services/auth.service";
import { ToastService } from "../../../shared/services/toast.service";

@Component({
	templateUrl: "login.component.html",
	imports: [
		NavigationComponent,
		FormsModule,
		ReactiveFormsModule,
		ModalComponent,
	],
})
export class LoginComponent {
	private authService = inject(AuthenticationService);
	private authStore = inject(AuthenticationStore);
	private toastService = inject(ToastService);

	loginError = this.authStore.loginError;
	registerError = this.authStore.registerError;

	loginForm: FormGroup;
	registerForm: FormGroup;

	forgotEmail?: string;
	forgotError = "";

	showForgotPwModal = signal(false);

	constructor() {
		this.loginForm = new FormGroup({
			usernameOrEmail: new FormControl("", Validators.required),
			password: new FormControl("", Validators.required),
		});

		this.registerForm = new FormGroup({
			username: new FormControl("", Validators.required),
			email: new FormControl("", Validators.required),
			password: new FormControl("", Validators.required),
		});
	}

	login() {
		this.loginForm.markAllAsTouched();
		if (this.loginForm.valid) {
			this.authStore.login(this.loginForm.value);
		}
	}

	register() {
		this.registerForm.markAllAsTouched();
		if (this.registerForm.valid) {
			this.authStore.register(this.registerForm.value);
		}
	}

	toggleForgotPwModal(toggle: boolean) {
		this.showForgotPwModal.set(toggle);
	}

	resetPassword() {
		if (this.forgotEmail) {
			this.authService.resetPassword(this.forgotEmail).subscribe(
				() => {
					this.toastService.setMessage(
						"We have send an email with your password!",
						false,
						"Success!"
					);
					this.toggleForgotPwModal(false);
					this.forgotError = "";
				},
				() => {
					this.forgotError = "The email adress was not found";
				}
			);
		}
	}
}
