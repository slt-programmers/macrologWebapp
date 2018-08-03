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
	public username: string;
	public password: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authenticationService: AuthenticationService) {}

  ngOnInit() {
    // reset login status
    this.authenticationService.logout();

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  onSubmit() {
		this.error = '';
    this.authenticationService.login(this.username, this.password)
        .pipe(first())
        .subscribe(
            data => {
                this.router.navigate([this.returnUrl]);
            },
            error => {
                console.log(error);
                if (error.status === 401){
                  this.error = 'Invalid username/password';
                } else {
                  this.error = 'Unknown error:' + error.message;
                }
            });
  }
}
