import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserAccount } from '../model/userAccount';

@Injectable()
export class AdminService {
  private http = inject(HttpClient);

  public macrologBackendUrl = '//' + environment.backend + '/admin';

  public getAllUsers(): Observable<UserAccount[]> {
    return this.http.get<UserAccount[]>(this.macrologBackendUrl + '/getAllUsers');
  }

  public deleteUser(user: UserAccount): Observable<void> {
    const options = {
      params: { userId: user.id.toString() },
    };
    return this.http.post<void>(this.macrologBackendUrl + '/deleteAccount', null, options);
  }
}
