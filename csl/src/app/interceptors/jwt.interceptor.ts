import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

     const headers = {'Content-Type': 'application/json',
   		'Access-Control-Allow-Origin': 'http://localhost:4200'
   	};

        if (currentUser && currentUser.token) {
        console.log('intercept 1');
            request = request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${currentUser.token}`,
                    'Access-Control-Allow-Origin': 'http://localhost:4200'
                }
            });
        } else {
        console.log('intercept 2');
            request = request.clone({
                setHeaders: headers
            });
        }


        return next.handle(request);
    }
}
