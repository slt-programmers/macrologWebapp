import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {Router} from '@angular/router';

import { AuthenticationService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
constructor(private authenticationService: AuthenticationService,private router: Router) {}



    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(catchError(err => {
            console.log(request);
            if (err.status === 403) {
                // 401 = bad login
                // 403 = forbidden page
                // auto logout
                this.authenticationService.logout();
                this.router.navigateByUrl(`/login`)
            } else if (err.status === 401) {
               // returning to login page
               console.log(err);
               return throwError(err);
            } else {
              const error = err.error.message || err.statusText;
              return throwError(error);
             }
        }))
    }
}
