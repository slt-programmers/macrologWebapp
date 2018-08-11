import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
	templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit {

  private returnUrl: string;
  public error = '';
  public signUpError = '';
	public username: string;
	public password: string;

	public newUsername: string;
	public newPassword: string;
	public newEmail: string;

	public forgotEmail: string;
	public forgotError: string;
	public showForgotPwModal: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService,
    private toastService: ToastService) {}

  ngOnInit() {
    // reset login status
    this.authService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  login() {
		this.error = '';
    this.authService.login(this.username, this.password)
        .subscribe(
            data => {
                this.router.navigate([this.returnUrl]);
            },
            error => {
								console.log(error);
                if (error.status === 401){
                  this.error = 'Password invalid';
                } else if (error.status === 404) {
                  this.error = 'Username not found';
                }
            });
  }

	signUp() {
		this.signUpError = '';
		this.authService.signup(this.newUsername, this.newPassword, this.newEmail)
			.subscribe(
				data => {
					this.authService.login(this.newUsername, this.newPassword)
						.subscribe(
              data => {
                this.router.navigate(['/user']);
              }, error => {
								console.log(error);
                this.signUpError = error;
            });
					this.newUsername = '';
					this.newPassword = '';
					this.newEmail = '';
				}, error => {
					if (error.status === 401) {
						this.signUpError = 'Username already in use';
					} else {
						this.signUpError = error.message;
					}
				});
	}

	public toggleForgotPwModal(toggle: boolean) {
		this.showForgotPwModal = toggle;
	}

	sendPassword() {
		this.forgotError = '';
		this.authService.retreivePassword(this.forgotEmail)
			.subscribe(data => {
				this.toastService.setMessage('We have send an email with your password!');
				this.toggleForgotPwModal(false);
			}, error => {
			    this.forgotError = 'The email you entered did not match the email registered with your username';
			});
	}

}
