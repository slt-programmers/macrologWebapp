import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const macrologBackendUrl = '//localhost:8090/api';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        return this.http.post<any>(macrologBackendUrl + '/authenticate', { username: username, password: password })
            .pipe(map((res:any) => {
                if (res && res.token) {
                   localStorage.setItem('currentUser', JSON.stringify({ 'user':res.name, 'token': res.token }));
                }
            }));
    }

    logout() {
       setTimeout(() => {
          localStorage.removeItem('currentUser');
       });
    }

	signup(username: string, password: string) {
		return this.http.post(macrologBackendUrl + '/signup', { username: username, password: password });
	}
}
