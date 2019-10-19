
import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { ErrorInterceptor } from './error.interceptor';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { HttpRequest, HttpHandler, HttpResponse, HttpClient, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthenticationService } from '@app/services/auth.service';
import { throwError, of } from 'rxjs';

describe('AuthService', () => {
  let httpClient: HttpClient;
  let interceptor: ErrorInterceptor;
  let router: Router;
  let authService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [ErrorInterceptor, HttpClient, HttpHandler, AuthenticationService, { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }]
    });
    interceptor = TestBed.get(ErrorInterceptor);
    httpClient = TestBed.get(HttpClient);
    router = TestBed.get(Router);
    authService = TestBed.get(AuthenticationService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create service', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should intercept forbidden status', fakeAsync(() => {
    spyOn(router, 'navigateByUrl');
    spyOn(authService, 'logout');
    const httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    httpHandlerSpy.handle.and.returnValue(throwError({ status: 403 }));

    interceptor.intercept(httpRequestSpy, httpHandlerSpy)
      .subscribe(
        () => { },
        err => {
          expect(router.navigateByUrl).toHaveBeenCalledWith('/');
          expect(authService.logout).toHaveBeenCalled();
        }
      );
    tick();
  }));

  it('should not intercept other error status', fakeAsync(() => {
    spyOn(router, 'navigateByUrl');
    spyOn(authService, 'logout');
    const httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    httpHandlerSpy.handle.and.returnValue(throwError({ status: 401 }));

    interceptor.intercept(httpRequestSpy, httpHandlerSpy)
      .subscribe(
        () => { },
        err => {
          expect(router.navigateByUrl).not.toHaveBeenCalled();
          expect(authService.logout).not.toHaveBeenCalled();
        }
      );
    tick();
  }));

  it('should not intercept valid requests', fakeAsync(() => {
    spyOn(router, 'navigateByUrl');
    spyOn(authService, 'logout');
    const httpRequestSpy = jasmine.createSpyObj('HttpRequest', ['doesNotMatter']);
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    httpHandlerSpy.handle.and.returnValue(of({ status: 200 }));

    interceptor.intercept(httpRequestSpy, httpHandlerSpy)
      .subscribe(
        () => {
          expect(router.navigateByUrl).not.toHaveBeenCalled();
          expect(authService.logout).not.toHaveBeenCalled();
        }
      );
    tick();
  }));

});
