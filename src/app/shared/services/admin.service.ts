import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserAccount } from '../model/userAccount';

@Injectable()
export class AdminService {
  private http = inject(HttpClient);

  public macrologBackendUrl = '//' + environment.backend + '/admin';

  public getAllUsers(): Observable<UserAccount[]> {
    return this.http.get<UserAccount[]>(this.macrologBackendUrl + '/getAllUsers').pipe(
      catchError(() => of()));
  }

  public deleteUser(user: UserAccount): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };
    const options = {
      headers: headers,
      params: { userId: user.id.toString() },
    };
    return this.http.post<any>(this.macrologBackendUrl + '/deleteAccount', null, options).pipe(
      catchError(() => of()));
  }
}
