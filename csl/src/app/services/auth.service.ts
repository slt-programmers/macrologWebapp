import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

const macrologBackendUrl = '//localhost:8090/api/authenticate';


@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    constructor(private http: HttpClient) { }

    login(username: string, password: string) {
        console.log("login attempt");
        return this.http.post<any>(macrologBackendUrl, { username: username, password: password })
            .pipe(map((res:any) => {
                
                // login successful if there's a jwt token in the response
                console.log(JSON.stringify({ username, token: res.token }));

                if (res && res.token) {
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    localStorage.setItem('currentUser', JSON.stringify({ username, token: res.token }));
                }
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
    }
}
