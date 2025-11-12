import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';
import { ErrorInterceptor } from './error.interceptor';
import { AuthenticationStore } from '../store/auth.store';

describe('AuthService', () => {
  let interceptor: ErrorInterceptor;
  let authStore: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ErrorInterceptor,
        MockProvider(ToastService),
        MockProvider(AuthenticationStore, {logout: () => {}}),
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
      ],
    });
    authStore = TestBed.inject(AuthenticationStore);
    interceptor = TestBed.inject(ErrorInterceptor);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create service', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should intercept forbidden status', () => {
    spyOn(authStore, 'logout');
    const httpRequestSpy = jasmine.createSpyObj('HttpRequest', [
      'doesNotMatter',
    ]);
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    httpHandlerSpy.handle.and.returnValue(throwError(() => ({ status: 403 })));

    interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
      () => { console.log('dummy') },
      () => {
        expect(authStore.logout).toHaveBeenCalled();
      }
    );
  });

  it('should not intercept other error status', () => {
    spyOn(authStore, 'logout');
    const httpRequestSpy = jasmine.createSpyObj('HttpRequest', [
      'doesNotMatter',
    ]);
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    httpHandlerSpy.handle.and.returnValue(throwError({ status: 401 }));

    interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(
      () => { console.log('dummy') },
      () => {
        expect(authStore.logout).not.toHaveBeenCalled();
      }
    );
  });

  it('should not intercept valid requests', () => {
    spyOn(authStore, 'logout');
    const httpRequestSpy = jasmine.createSpyObj('HttpRequest', [
      'doesNotMatter',
    ]);
    const httpHandlerSpy = jasmine.createSpyObj('HttpHandler', ['handle']);
    httpHandlerSpy.handle.and.returnValue(of({ status: 200 }));

    interceptor.intercept(httpRequestSpy, httpHandlerSpy).subscribe(() => {
      expect(authStore.logout).not.toHaveBeenCalled();
    });
  });
});
