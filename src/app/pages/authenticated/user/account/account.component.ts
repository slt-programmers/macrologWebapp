import { Component } from '@angular/core';
import { AuthenticationService } from '../../../../shared/services/auth.service';
import { ToastService } from '../../../../shared/services/toast.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ml-account',
  templateUrl: './account.component.html',
})
export class AccountComponent {
  public message = '';
  public oldPassword: string;
  public newPassword: string;
  public confirmPassword: string;
  public modalOpen = false;
  public password: string;
  public errorMessage: string;

  constructor(
    private authService: AuthenticationService,
    private toastService: ToastService,
    private router: Router
  ) {}

  public changePassword() {
    this.message = '';
    if (this.newPassword !== this.confirmPassword) {
      this.message =
        'The confirmation password does not match with the new password.';
    } else {
      this.authService
        .changePassword(
          this.oldPassword,
          this.newPassword,
          this.confirmPassword
        )
        .subscribe(
          (data) => {
            if (data.status === 200) {
              this.toastService.setMessage('Your password has changed');
              this.oldPassword = '';
              this.newPassword = '';
              this.confirmPassword = '';
            }
          },
          (error) => {
            if (
              error.status === 400 &&
              error.error === 'passwords do not match'
            ) {
              this.message =
                'The confirmation password does not match with the new password.';
            } else if (error.status === 401) {
              this.message = 'Password invalid';
            }
          }
        );
    }
  }

  public deleteAccount() {
    this.authService.deleteAccount(this.password).subscribe(
      () => {
        localStorage.clear();
        this.router.navigate(['/']);
      },
      (err) => {
        if (err.status === 401) {
          this.errorMessage = 'Password is incorrect';
        } else {
          // TODO
        }
      }
    );
  }

  public openModal() {
    this.modalOpen = true;
  }

  public closeModal() {
    this.modalOpen = false;
  }
}
