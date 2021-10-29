import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserAccount } from '../model/userAccount';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {

  private readonly macrologBackendUrl = '//' + environment.backend + '/api';

  constructor(private http: HttpClient) { }

  public isAuthenticated(): boolean {
    const user = localStorage.getItem('currentUser');
    return !!user;
  }

  public isAdmin(): boolean {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return !!currentUser && currentUser.admin;
  }

  public login(usernameOrEmail: string, password: string): Observable<UserAccount> {
    return this.http.post<UserAccount>(this.macrologBackendUrl + '/authenticate', {
      username: usernameOrEmail,
      password: password,
    }).pipe(
      map((res: UserAccount) => {
        if (res && res.token) {
          localStorage.setItem('currentUser', JSON.stringify(res));
        }
      }),
      catchError(error => { return of<any>() })
    );
  }

  public logout(): void {
    localStorage.removeItem('currentUser');
  }

  public changePassword(oldPassword: string, newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.post<any>(this.macrologBackendUrl + '/changePassword', {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword,
    }).pipe(catchError(error => of<any>()));
  }

  public register(username: string, email: string, password: string): Observable<any> {
    return this.http.post<any>(this.macrologBackendUrl + '/signup', {
      username: username,
      email: email,
      password: password,
    }).pipe(catchError(error => of<any>()));
  }

  public resetPassword(email: string): Observable<any> {
    return this.http.post<any>(this.macrologBackendUrl + '/resetPassword', {
      email: email,
    }).pipe(catchError(error => of<any>()));
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
    ).pipe(catchError(error => of<any>()));
  }
}
