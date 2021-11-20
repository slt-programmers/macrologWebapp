import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { AuthenticationService } from '../services/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private authService: AuthenticationService, private readonly toastService: ToastService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((result) => {
        return result;
      }),
      catchError((err) => {
        if (err.status === 403) {
          this.authService.logout();
          return throwError(err);
        } else {
          this.toastService.setMessage(err.message, true, 'Error');
          return throwError(err);
        }
      })
    );
  }
}
