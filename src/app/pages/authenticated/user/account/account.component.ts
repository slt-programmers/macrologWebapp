import { Component, inject } from "@angular/core";
import {
	FormControl,
	FormGroup,
	FormsModule,
	ReactiveFormsModule,
	Validators,
} from "@angular/forms";
import { AuthenticationStore } from "src/app/shared/store/auth.store";
import { ModalComponent } from "../../../../shared/components/modal/modal.component";
import { CustomValidators } from "src/app/util/validators";

@Component({
	selector: "ml-account",
	templateUrl: "./account.component.html",
	imports: [FormsModule, ReactiveFormsModule, ModalComponent],
})
export class AccountComponent {
	private readonly authStore = inject(AuthenticationStore);

	form = new FormGroup(
		{
			oldPassword: new FormControl("", Validators.required),
			newPassword: new FormControl("", Validators.required),
			confirmPassword: new FormControl("", Validators.required),
		},
		{ validators: [CustomValidators.equals("newPassword", "confirmPassword")] }
	);

	deleteError = this.authStore.deleteError;
	message = this.authStore.changePasswordError;

	modalOpen = false;
	password?: string;

	changePassword() {
		this.form.markAllAsTouched();
		if (this.form.valid) {
			this.authStore.changePassword(this.form.value as ChangePasswordRequest);
			this.form.reset();
		}
	}

	deleteAccount() {
		if (this.password) {
			this.authStore.deleteAccount(this.password);
		}
	}

	openModal() {
		this.modalOpen = true;
	}

	closeModal() {
		this.modalOpen = false;
	}
}
