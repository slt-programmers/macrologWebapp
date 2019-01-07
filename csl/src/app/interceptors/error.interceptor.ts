import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpResponse, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { of } from 'rxjs/internal/observable/of';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/auth.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
constructor(private authenticationService: AuthenticationService, private router: Router) {}

	intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
		return next.handle(request).pipe(
				map(result => {
					console.log('Error interceptor positive', result);
					return result;
				}),
				catchError(err => {
					console.log('Error interceptor negative', err);
					if (err.status === 403) {
						console.log(err.status)
						this.authenticationService.logout();
						this.router.navigateByUrl('/login');
						return throwError(err);
					} else if (err.status === 401) {
						console.log(err.status)
						return throwError(err);
					} else if (err.status === 404) {
						console.log(err.status);
						return throwError(err);
					} else if (err.status === 0) {
						console.log(err.status);
						return throwError(err);
					} else {
						console.log('Else in interceptor, WHY?');
						console.log(err);
						return of(new HttpResponse({body: err}));
					}
			})
		);
	}
}
