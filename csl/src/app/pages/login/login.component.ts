import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';


import { AuthenticationService } from '../../services/auth.service';
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

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthenticationService) {}

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
		this.authService.signup(this.newUsername, this.newPassword)
			.subscribe(
				data => {
					console.log('Signup succesful');
					this.signUpError = 'Signup succesful';
					this.username = this.newUsername;
					this.newUsername = '';
					this.newPassword = '';
					// TODO: navigate to user settings page to fill in info for the first time
				}, error => {
					if (error.status === 401) {
						this.signUpError = 'Username already in use';
					} else {
						this.signUpError = error.message;
					}
				});
	}
}
