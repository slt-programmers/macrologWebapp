import { Injectable, inject } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ToastService } from '../services/toast.service';
import { AuthenticationStore } from '../store/auth.store';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  private readonly authStore = inject(AuthenticationStore);
  private readonly toastService = inject(ToastService);

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      map((result) => {
        return result;
      }),
      catchError((err) => {
        if (err.status === 403) {
          this.authStore.logout();
        } else if (err.status === 500) {
          this.toastService.setMessage(err.message, true, 'Failed!');
        }
        return throwError(() => err);
      })
    );
  }
}
