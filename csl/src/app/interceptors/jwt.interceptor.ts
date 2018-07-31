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
const options = { headers: headers };

       if (currentUser && currentUser.token) {
            // Secured request
            request = request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${currentUser.token}`,
                    'Access-Control-Allow-Origin': 'http://localhost:4200',
                    'Access-Control-Allow-Methods': 'PUT, GET, POST',
                    'Access-Control-Allow-Headers': 'Origin, Methods, Content-Type, Accept'
                }
            });
        } else {
             // Not logged in request
             request = request.clone({
                setHeaders: {
                    'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
                    'Access-Control-Allow-Origin': 'http://localhost:4200',
                    'Access-Control-Allow-Methods': 'PUT, GET, POST'
                }
            });
        }
        return next.handle(request);
    }
}
