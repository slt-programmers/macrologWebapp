import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserAccount } from '../model/userAccount';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class AdminService {
  public macrologBackendUrl = '//' + environment.backend + '/admin';

  constructor(private http: HttpClient) { }

  public getAllUsers(): Observable<UserAccount[]> {
    return this.http.get<UserAccount[]>(
      this.macrologBackendUrl + '/getAllUsers',
      { responseType: 'json' }
    ).pipe(catchError(error => of<any>()));
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
    return this.http.post<any>(
      this.macrologBackendUrl + '/deleteAccount',
      null,
      options
    ).pipe(catchError(error => of<any>()));
  }
}
