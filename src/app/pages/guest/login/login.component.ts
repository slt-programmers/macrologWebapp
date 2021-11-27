import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../shared/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private returnUrl: string;

  public loginForm: FormGroup;
  public registerForm: FormGroup;
  public loginError = '';
  public registerError = '';
  public forgotEmail: string;
  public forgotError: string;

  public showForgotPwModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private toastService: ToastService
  ) {
    this.loginForm = new FormGroup({
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });

    this.registerForm = new FormGroup({
      username: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
    })
  }

  ngOnInit() {
    this.authService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
  }

  public login() {
    this.loginForm.markAllAsTouched();
    if (this.loginForm.valid) {
      this.loginError = '';
      const data = this.loginForm.value;
      this.authService.login(data.username, data.password).subscribe(
        () => {
          this.router.navigate([this.returnUrl]);
        },
        () => {
          this.loginError = 'Username or password incorrect';
        }
      );
    }
  }

  public register() {
    this.registerForm.markAllAsTouched();
    if (this.registerForm.valid) {
      this.registerError = '';
      const data = this.registerForm.value;
      this.authService.register(data.username, data.email, data.password).subscribe(() => {
        this.authService.login(data.username, data.password).subscribe(
          () => {
            this.router.navigate(['dashboard', 'onboarding']);
          }
        );
      }, (error) => {
        if (error.status === 401) {
          if (error.error === 'Username or email already in use') {
            this.registerError =
              "Username or email is already in use. Please try a different username or use 'Forgot password' to retrieve a new password.";
          } else {
            this.registerError = 'Unknown error during registration.';
          }
        } else {
          this.registerError = 'Unknown error during registration.';
        }
      });
    }
  }

  public toggleForgotPwModal(toggle: boolean) {
    this.showForgotPwModal = toggle;
  }

  public resetPassword() {
    this.forgotError = '';
    this.authService.resetPassword(this.forgotEmail).subscribe(
      () => {
        this.toastService.setMessage('We have send an email with your password!', false, 'Success!');
        this.toggleForgotPwModal(false);
      },
      () => {
        this.forgotError = 'The email adress was not found';
      }
    );
  }
}
