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
				style({ opacity: 0, marginTop: '15px' }),
				animate('0.3s', style({ opacity: 1, marginTop: '0' })),
			]),
		]),
	],
	styleUrls: ['./login.scss']
})
export class LoginComponent implements OnInit {

	private returnUrl: string;

	public loginError = '';
	public signUpError = '';
	public usernameOrEmail: string;
	public password: string;

	public newUsername: string;
	public newPassword: string;
	public newEmail: string;

	public forgotEmail: string;
	public forgotError: string;

	public showForgotPwModal = false;
	public showContentLogin = true;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private authService: AuthenticationService,
		private toastService: ToastService) { }

	ngOnInit() {
		this.authService.logout();
		this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
	}

	public toggleLogin(showContentLogin: boolean) {
		this.showContentLogin = showContentLogin;
	}

	public login() {
		this.loginError = '';
		this.authService.login(this.usernameOrEmail, this.password)
			.subscribe(
				res => {
					console.log('success');
					this.router.navigate([this.returnUrl]);
				},
				err => {
					console.log(err);
					this.loginError = 'Username or password incorrect';
				});
	}

	public signUp() {
		this.signUpError = '';
		this.authService.signUp(this.newUsername, this.newPassword, this.newEmail)
			.subscribe(
				res => {
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
				}, err => {
					if (err.status === 401) {
						if (err.error === 'Username already in use') {
							this.signUpError = 'Username is already in use.';
						} else if (err.error === 'Email already in use') {
							this.signUpError = 'Email is already in use. Use \"Forgot password\" to retrieve a new password.';
						} else {
							this.signUpError = 'Unknown error during signup.';
						}
					} else {
						this.signUpError = err.message;
					}
				});
	}

	public toggleForgotPwModal(toggle: boolean) {
		this.showForgotPwModal = toggle;
	}

	public resetPassword() {
		this.forgotError = '';
		this.authService.resetPassword(this.forgotEmail)
			.subscribe(
				res => {
					this.toastService.setMessage('We have send an email with your password!');
					this.toggleForgotPwModal(false);
				}, err => {
					this.forgotError = 'The email adress was not found';
				});
	}
}
