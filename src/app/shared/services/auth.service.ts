import { HttpClient } from "@angular/common/http";
import { Injectable, inject } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { UserAccount } from "../model/userAccount";

@Injectable({ providedIn: "root" })
export class AuthenticationService {
	private readonly http = inject(HttpClient);
	private readonly macrologBackendUrl = "//" + environment.backend + "/api";

	login(usernameOrEmail: string, password: string): Observable<UserAccount> {
		return this.http.post<UserAccount>(
			this.macrologBackendUrl + "/authenticate",
			{
				username: usernameOrEmail,
				password: password,
			}
		);
	}

	register(username: string, email: string, password: string): Observable<any> {
		return this.http.post<any>(this.macrologBackendUrl + "/signup", {
			username: username,
			email: email,
			password: password,
		});
	}

	resetPassword(email: string): Observable<string> {
		return this.http.post<string>(this.macrologBackendUrl + "/resetPassword", {
			email: email,
		});
	}

	changePassword(
		oldPassword: string,
		newPassword: string,
		confirmPassword: string
	): Observable<string> {
    // TODO 'OK' response JSON parse error, something with headers
		return this.http.post<string>(this.macrologBackendUrl + "/changePassword", {
			oldPassword: oldPassword,
			newPassword: newPassword,
			confirmPassword: confirmPassword,
		});
	}

	deleteAccount(password: string): Observable<void> {
		return this.http.post<void>(
			this.macrologBackendUrl + "/deleteAccount",
			null,
			{ params: { password: password } }
		);
	}
}
