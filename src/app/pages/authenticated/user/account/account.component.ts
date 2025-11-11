import { Component, inject } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { AuthenticationStore } from "src/app/shared/store/auth.store";
import { ModalComponent } from "../../../../shared/components/modal/modal.component";

@Component({
	selector: "ml-account",
	templateUrl: "./account.component.html",
	imports: [FormsModule, ModalComponent],
})
export class AccountComponent {
	private readonly authStore = inject(AuthenticationStore);

	deleteError = this.authStore.deleteError;
	message = this.authStore.changePasswordError;
	oldPassword?: string;
	newPassword?: string;
	confirmPassword?: string;
	modalOpen = false;
	password?: string;

	changePassword() {
		if (this.newPassword !== this.confirmPassword) {
			this.authStore.setChangePasswordError(
				"The confirmation password does not match with the new password."
			);
		} else {
			this.authStore.changePassword({
				oldPassword: this.oldPassword!,
				newPassword: this.newPassword!,
				confirmPassword: this.confirmPassword!,
			});
			this.oldPassword = "";
			this.newPassword = "";
			this.confirmPassword = "";
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
