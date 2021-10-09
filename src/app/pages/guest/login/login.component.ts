import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../../shared/services/auth.service';
import { ToastService } from '../../../shared/services/toast.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  templateUrl: 'login.component.html',
  animations: [
    trigger('enterLeaveTrigger', [
      transition(':enter', [
        style({ opacity: 0, marginTop: '15px' }),
        animate('0.3s', style({ opacity: 1, marginTop: '0' })),
      ]),
    ]),
  ],
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  private returnUrl: string;

  public loginError = '';
  public registerError = '';
  public usernameOrEmail: string;
  public password: string;

  public newUsername: string;
  public newEmail: string;
  public newPassword: string;

  public forgotEmail: string;
  public forgotError: string;

  public showForgotPwModal = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.authService.logout();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || 'dashboard';
  }

  public login() {
    this.loginError = '';
    this.authService.login(this.usernameOrEmail, this.password).subscribe(
      () => {
        this.router.navigate([this.returnUrl]);
      },
      () => {
        this.loginError = 'Username or password incorrect';
      }
    );
  }

  public register() {
    this.registerError = '';
    this.authService
      .register(this.newUsername, this.newEmail, this.newPassword)
      .subscribe(
        () => {
          this.authService.login(this.newUsername, this.newPassword).subscribe(
            () => {
              this.router.navigate(['dashboard', 'onboarding']);
            },
            () => {
              this.registerError = 'Error on login after registration.';
            }
          );
          this.newUsername = '';
          this.newEmail = '';
          this.newPassword = '';
        },
        (err) => {
          if (err.status === 401) {
            if (err.error === 'Username or email already in use') {
              this.registerError =
                "Username or email is already in use. Please try a different username or use 'Forgot password' to retrieve a new password.";
            } else {
              this.registerError = 'Unknown error during registration.';
            }
          } else {
            this.registerError = 'Unknown error during registration.';
          }
        }
      );
  }

  public toggleForgotPwModal(toggle: boolean) {
    this.showForgotPwModal = toggle;
  }

  public resetPassword() {
    this.forgotError = '';
    this.authService.resetPassword(this.forgotEmail).subscribe(
      () => {
        this.toastService.setMessage(
          'We have send an email with your password!'
        );
        this.toggleForgotPwModal(false);
      },
      () => {
        this.forgotError = 'The email adress was not found';
      }
    );
  }
}
