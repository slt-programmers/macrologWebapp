import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserAccount } from '../model/userAccount';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
  private http = inject(HttpClient);

  private readonly macrologBackendUrl = '//' + environment.backend + '/api';

  public isAuthenticated(): boolean {
    const user = localStorage.getItem('currentUser');
    return !!user;
  }

  public isAdmin(): boolean {
    const currentUser = localStorage.getItem('currentUser');
    return !!currentUser && JSON.parse(currentUser).admin;
  }

  public login(usernameOrEmail: string, password: string): Observable<UserAccount> {
    return this.http.post<UserAccount>(this.macrologBackendUrl + '/authenticate', {
      username: usernameOrEmail,
      password: password,
    });
  }

  public register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(this.macrologBackendUrl + '/signup', {
      username: username,
      email: email,
      password: password,
    });
  }

  public resetPassword(email: string): Observable<any> {
    return this.http.post<any>(this.macrologBackendUrl + '/resetPassword', {
      email: email,
    });
  }

  public logout(): void {
    localStorage.removeItem('currentUser');
  }

  public changePassword(oldPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.post<any>(this.macrologBackendUrl + '/changePassword', {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    });
  }

  public deleteAccount(password: string): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };
    const options = { headers: headers, params: { password: password } };
    return this.http.post<any>(
      this.macrologBackendUrl + '/deleteAccount',
      null,
      options
    );
  }
}
