import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';



@Injectable({ providedIn: 'root' })
export class AuthenticationService {

    macrologBackendUrl = '//'+environment.backend+'/api';

    constructor(private http: HttpClient) {
   }

    login(username: string, password: string) {
        return this.http.post<any>(this.macrologBackendUrl + '/authenticate', { username: username, password: password })
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

	signup(username: string, password: string, email: string) {
		return this.http.post(this.macrologBackendUrl + '/signup', { username: username, password: password, email: email });
	}

	retreivePassword(email: string) {
		return this.http.post(this.macrologBackendUrl + '/validate', { username: '', password: '', email: email });
	}

}
