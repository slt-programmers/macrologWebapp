import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // add authorization header with jwt token if available
        let currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (currentUser && currentUser.token) {
            // Secured request
            request = request.clone({
                setHeaders: {
                    'Authorization': `Bearer ${currentUser.token}`,
                    'Access-Control-Allow-Origin': environment.origin ,
                    'Access-Control-Allow-Methods': 'PUT, GET, POST',
                    'Access-Control-Allow-Headers': 'Origin, Methods, Content-Type, Accept'
                }
            });
        } else {
             // Not logged in request
             request = request.clone({
                setHeaders: {
                    'Access-Control-Allow-Headers': 'Access-Control-Allow-Origin, Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers',
                    'Access-Control-Allow-Origin': environment.origin,
                    'Access-Control-Allow-Methods': 'PUT, GET, POST'
                }
            });
        }
        return next.handle(request);
    }
}
