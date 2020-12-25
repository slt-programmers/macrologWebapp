import { TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ErrorInterceptor } from './error.interceptor';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import {
  HttpHandler,
  HttpClient,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';
import { throwError, of } from 'rxjs';
import { AuthenticationService } from '../shared/services/auth.service';

describe('AuthService', () => {
  let httpClient: HttpClient;
  let interceptor: ErrorInterceptor;
  let router: Router;
  let authService: AuthenticationService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      providers: [
        ErrorInterceptor,
        HttpClient,
        HttpHandler,
        AuthenticationService,
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      ],
    });
    interceptor = TestBed.inject(ErrorInterceptor);
    httpClient = TestBed.inject(HttpClient);
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthenticationService);
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
    const httpRequestSpy = jasmine.createSpyObj('HttpRequest', [
      'doesNotMatter',
    ]);
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    httpHandlerSpy.handle.and.returnValue(throwError({ status: 403 }));

    interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
      () => {},
      (err) => {
        expect(authService.logout).toHaveBeenCalled();
      }
    );
    tick();
  }));

  it('should not intercept other error status', fakeAsync(() => {
    spyOn(router, 'navigateByUrl');
    spyOn(authService, 'logout');
    const httpRequestSpy = jasmine.createSpyObj('HttpRequest', [
      'doesNotMatter',
    ]);
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    httpHandlerSpy.handle.and.returnValue(throwError({ status: 401 }));

    interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
      () => {},
      (err) => {
        expect(router.navigateByUrl).not.toHaveBeenCalled();
        expect(authService.logout).not.toHaveBeenCalled();
      }
    );
    tick();
  }));

  it('should not intercept valid requests', fakeAsync(() => {
    spyOn(router, 'navigateByUrl');
    spyOn(authService, 'logout');
    const httpRequestSpy = jasmine.createSpyObj('HttpRequest', [
      'doesNotMatter',
    ]);
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    httpHandlerSpy.handle.and.returnValue(of({ status: 200 }));

    interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(() => {
      expect(router.navigateByUrl).not.toHaveBeenCalled();
      expect(authService.logout).not.toHaveBeenCalled();
    });
    tick();
  }));
});
