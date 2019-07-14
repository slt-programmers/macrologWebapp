import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
	templateUrl: 'login.component.html', 
	animations: [
		trigger('enterLeaveTrigger', [
			transition(':enter', [
			  style({ opacity: 0 }),
			  animate('0.25s', style({ opacity: 1 })),
			]),
			// transition(':leave', [
			//   animate('5s', style({ opacity: 0 }))
			// ])
		  ]),
	],
	styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {

	private returnUrl: string;

	public showContentLogin = true;

	public error = '';
	public signUpError = '';
	public usernameOrEmail: string;
	public password: string;

	public newUsername: string;
	public newPassword: string;
	public newEmail: string;

	public forgotEmail: string;
	public forgotError: string;
	public showForgotPwModal = false;

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

	public toggleLogin(showContentLogin: boolean) {
		this.showContentLogin = showContentLogin;
	}

	public login() {
		this.error = '';
		this.authService.login(this.usernameOrEmail, this.password)
				.subscribe(
						data => {
							this.router.navigate([this.returnUrl]);
						},
						error => {
								console.log(error);
								if (error.status === 401) {
									this.error = 'Password invalid';
								} else if (error.status === 404) {
									this.error = 'Username or email not found';
								}
				});
	}

	public signUp() {
		this.signUpError = '';
		this.authService.signUp(this.newUsername, this.newPassword, this.newEmail)
			.subscribe(
				data => {
					this.authService.login(this.newUsername, this.newPassword)
						.subscribe(
							() => {
								this.router.navigate(['/intake']);
							}, error => {
								console.log(error);
								this.signUpError = error;
						});
					this.newUsername = '';
					this.newPassword = '';
					this.newEmail = '';
				}, error => {
					if (error.status === 401) {
						if (error.error === 'Username already in use') {
							this.signUpError = 'Username is already in use.';
						} else if (error.error === 'Email already in use') {
							this.signUpError = 'Email is already in use. Use \"Forgot password\" to retrieve a new password.';
						} else {
							this.signUpError = 'Unknown error during signup.';
						}
					} else {
						this.signUpError = error.message;
					}
				});
	}

	public toggleForgotPwModal(toggle: boolean) {
		this.showForgotPwModal = toggle;
	}

	public resetPassword() {
		this.forgotError = '';
		this.authService.resetPassword(this.forgotEmail)
			.subscribe(data => {
				this.toastService.setMessage('We have send an email with your password!');
				this.toggleForgotPwModal(false);
			}, error => {
				this.forgotError = 'The email adress was not found';
			});
	}
}
