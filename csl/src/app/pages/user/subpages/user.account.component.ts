import {Component }from '@angular/core';
import { AuthenticationService } from '../../../services/auth.service';


@Component({
  selector: 'userAccount',
  templateUrl: './user.account.component.html'
})
export class UserAccountComponent {

	public message = '';
	public oldPassword: string;
	public newPassword: string;
	public confirmPassword: string;

  constructor(private authService: AuthenticationService) {
  }

  changePassword() {
		if (this.newPassword !== this.confirmPassword) {
			this.message = 'The confirmation password does not match with the new password.';
		} else {
      this.authService.changePassword(this.oldPassword, this.newPassword, this.confirmPassword)
        .subscribe(
            data => {
                if (data.status === 400 && data.error === "passwords do not match"){
									this.message = 'The confirmation password does not match with the new password.'
                } else if (data.status === 200){
                  this.message = 'Password changed.';
                }
            },
            error => {
                console.log('error occured');
								if (error.status === 401){
                  this.message = 'Password invalid';
                }
            });
		}
  }

}