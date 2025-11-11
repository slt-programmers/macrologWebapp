import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationStore } from 'src/app/shared/store/auth.store';
import { ModalComponent } from '../../../shared/components/modal/modal.component';
import { NavigationComponent } from '../../../shared/components/navigation/navigation.component';
import { AuthenticationService } from '../../../shared/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  templateUrl: 'login.component.html',
  imports: [NavigationComponent, FormsModule, ReactiveFormsModule, ModalComponent]
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthenticationService);
  private authStore = inject(AuthenticationStore);
  private toastService = inject(ToastService);

  public loginForm: FormGroup;
  public registerForm: FormGroup;

  public loginError = this.authStore.loginError;
  public registerError = this.authStore.registerError;

  public forgotEmail?: string;
  public forgotError = '';

  showForgotPwModal = signal(false);

  constructor() {
    this.loginForm = new FormGroup({
      usernameOrEmail: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    })
  }

  public login() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.authStore.login(this.loginForm.value);
    }
  }

  public register() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      this.authStore.register(this.registerForm.value);
      // this.authService.register(data.username, data.email, data.password).subscribe(() => {
      //   this.authService.login(data.username, data.password).subscribe(
      //     () => {
      //       this.router.navigate(['dashboard', 'onboarding']);
      //     }
      //   );
      // }, (error) => {
      //   if (error.status === 401) {
      //     if (error.error === 'Username or email already in use') {
      //       this.registerError =
      //         "Username or email is already in use. Please try a different username or use 'Forgot password' to retrieve a new password.";
      //     } else {
      //       this.registerError = 'Unknown error during registration.';
      //     }
      //   } else {
      //     this.registerError = 'Unknown error during registration.';
      //   }
      // });
    }
  }

  public toggleForgotPwModal(toggle: boolean) {
    this.showForgotPwModal.set(toggle);
  }

  public resetPassword() {
    if (this.forgotEmail) {
      this.authService.resetPassword(this.forgotEmail).subscribe(
        () => {
          this.toastService.setMessage('We have send an email with your password!', false, 'Success!');
          this.toggleForgotPwModal(false);
          this.forgotError = '';
        },
        () => {
          this.forgotError = 'The email adress was not found';
        }
      );
    }
  }
}
