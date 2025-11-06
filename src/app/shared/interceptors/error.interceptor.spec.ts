import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { AuthenticationService } from '../services/auth.service';
import { ToastService } from '../services/toast.service';
import { ErrorInterceptor } from './error.interceptor';

describe('AuthService', () => {
  let interceptor: ErrorInterceptor;
  let authService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorInterceptor,
        MockProvider(ToastService),
        MockProvider(AuthenticationService),
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      ],
    });
    interceptor = TestBed.inject(ErrorInterceptor);
    authService = TestBed.inject(AuthenticationService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create service', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should intercept forbidden status', () => {
    spyOn(authService, 'logout');
    const httpRequestSpy = jasmine.createSpyObj('HttpRequest', [
      'doesNotMatter',
    ]);
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    httpHandlerSpy.handle.and.returnValue(throwError(() => ({ status: 403 })));

    interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
      () => { console.log('dummy') },
      () => {
        expect(authService.logout).toHaveBeenCalled();
      }
    );
  });

  it('should not intercept other error status', () => {
    spyOn(authService, 'logout');
    const httpRequestSpy = jasmine.createSpyObj('HttpRequest', [
      'doesNotMatter',
    ]);
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    httpHandlerSpy.handle.and.returnValue(throwError({ status: 401 }));

    interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
      () => { console.log('dummy') },
      () => {
        expect(authService.logout).not.toHaveBeenCalled();
      }
    );
  });

  it('should not intercept valid requests', () => {
    spyOn(authService, 'logout');
    const httpRequestSpy = jasmine.createSpyObj('HttpRequest', [
      'doesNotMatter',
    ]);
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    httpHandlerSpy.handle.and.returnValue(of({ status: 200 }));

    interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(() => {
      expect(authService.logout).not.toHaveBeenCalled();
    });
  });
});
