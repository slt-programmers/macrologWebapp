import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthenticationService } from '../shared/services/auth.service';
import { Observable, throwError } from 'rxjs';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(
    private authService: AuthenticationService,
    private router: Router
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((result) => {
        return result;
      }),
      catchError((err) => {
        if (err.status === 403) {
          this.authService.logout();
          // this.router.navigateByUrl('/');
          return throwError(err);
        } else {
          return throwError(err);
        }
      })
    );
  }
}
