import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpResponse, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
constructor(private authenticationService: AuthenticationService, private router: Router) {}

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(request).pipe(
					map(result => {
							return result;
					}),
          catchError(err => {
            console.log("In error interceptor intercepting error",err);
            if (err.status === 403) {
            // forbidden page
              this.authenticationService.logout();
              this.router.navigateByUrl(`/login`)
              return throwError(err);
            } else if (err.status === 401) {
            // unautorized
               return throwError(err);
						} else if (err.status === 404){
						// not found
								return throwError(err);
            } else {
							console.log('Else in interceptor');
							console.log(err);
           //   const error = err.error.message || err.statusText;
              return of(new HttpResponse({body: err}));
             }
        }))
    }
}
