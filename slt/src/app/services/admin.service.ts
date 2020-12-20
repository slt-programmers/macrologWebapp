import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { UserAccount } from '../model/userAccount';

@Injectable()
export class AdminService {
  private macrologBackendUrl = '//' + environment.backend + '/admin';

  constructor(private http: HttpClient) {}

  public getAllUsers() {
    return this.http.get<UserAccount[]>(
      this.macrologBackendUrl + '/getAllUsers',
      { responseType: 'json' }
    );
  }

  public deleteUser(user: UserAccount) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };
    const options = {
      headers: headers,
      params: { userId: user.id.toString() },
    };
    return this.http.post(
      this.macrologBackendUrl + '/deleteAccount',
      null,
      options
    );
  }
}
