import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

	macrologBackendUrl = '//' + environment.backend + '/api';

	constructor(private http: HttpClient) {}

	public isAuthenticated(): boolean {
		const user = localStorage.getItem('currentUser');
		return (user != null);
	}

	public login(usernameOrEmail: string, password: string) {
		return this.http.post<any>(this.macrologBackendUrl + '/authenticate', { username: usernameOrEmail, password: password })
				.pipe(map((res: any) => {
					if (res && res.token) {
						localStorage.setItem('currentUser', JSON.stringify({ 'user': res.name, 'token': res.token }));
					}
				})
		);
	}

	public changePassword(oldPassword: string, newPassword: string, confirmPassword: string) {
		return this.http.post<any>(this.macrologBackendUrl + '/changePassword',
				{ oldPassword: oldPassword, newPassword: newPassword, confirmPassword: confirmPassword});
	}

	public logout() {
		setTimeout(() => {
			localStorage.removeItem('currentUser');
		});
	}

	public register(username: string, password: string, email: string) {
		return this.http.post(this.macrologBackendUrl + '/signup', { username: username, password: password, email: email });
	}

	public resetPassword(email: string) {
		return this.http.post(this.macrologBackendUrl + '/resetPassword', { email: email });
	}

}
