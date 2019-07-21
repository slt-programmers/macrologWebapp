import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { UserAccount } from '@app/model/userAccount';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

	macrologBackendUrl = '//' + environment.backend + '/api';

	constructor(private http: HttpClient) { }

	public isAuthenticated(): boolean {
		const user = localStorage.getItem('currentUser');
		return (user != null);
	}

	public login(usernameOrEmail: string, password: string) {
		return this.http.post<any>(this.macrologBackendUrl + '/authenticate', { username: usernameOrEmail, password: password })
			.pipe(map((res: UserAccount) => {
				if (res && res.token) {
					localStorage.setItem('currentUser', JSON.stringify(res));
				}
			}));
	}

	public changePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
		return this.http.post<any>(this.macrologBackendUrl + '/changePassword',
			{ oldPassword: oldPassword, newPassword: newPassword, confirmPassword: confirmPassword });
	}

	public logout() {
		setTimeout(() => {
			localStorage.removeItem('currentUser');
		});
	}

	public register(username: string, email: string, password: string) {
		return this.http.post(this.macrologBackendUrl + '/signup', { username: username, email: email, password: password });
	}

	public resetPassword(email: string) {
		return this.http.post(this.macrologBackendUrl + '/resetPassword', { email: email });
	}

}
