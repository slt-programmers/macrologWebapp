import { inject, Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { AuthenticationStore } from '../store/auth.store';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  private readonly authStore = inject(AuthenticationStore);

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = this.authStore.token();
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
          'Access-Control-Allow-Origin': environment.origin,
          'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
          'Access-Control-Allow-Headers':
            'Origin, Methods, Content-Type, Accept',
        },
      });
    } else {
      request = request.clone({
        setHeaders: {
          'Access-Control-Allow-Headers':
            'Access-Control-Allow-Origin, Accept, X-Requested-With, Content-Type, ' +
            'Access-Control-Request-Method, Access-Control-Request-Headers',
          'Access-Control-Allow-Origin': environment.origin,
          'Access-Control-Allow-Methods': 'PUT, GET, POST, DELETE, OPTIONS',
        },
      });
    }

    return next.handle(request);
  }
}
