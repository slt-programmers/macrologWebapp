import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { AuthenticationService } from '../services/auth.service';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private authService = inject(AuthenticationService);
  private readonly toastService = inject(ToastService);


  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((result) => {
        return result;
      }),
      catchError((err) => {
        console.log('here')
        console.log(err)
        if (err.status === 403) {
          this.authService.logout();
          return throwError(err);
        } else {
          this.toastService.setMessage(err.message, true, 'Failed!');
          return throwError(err);
        }
      })
    );
  }
}
