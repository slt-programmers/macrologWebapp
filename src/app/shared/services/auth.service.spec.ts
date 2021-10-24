import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AuthenticationService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { MockProvider } from 'ng-mocks';

describe('AuthService', () => {
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        AuthenticationService,
        HttpClient],
    });
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create service', () => {
    const service = TestBed.inject(AuthenticationService);
    expect(service).toBeTruthy();
  });

  it('should check if authenticated', () => {
    const service = TestBed.inject(AuthenticationService);
    let result = service.isAuthenticated();
    expect(result).toBeFalsy();
    localStorage.setItem(
      'currentUser',
      JSON.stringify({ userName: 'username', token: 'token' })
    );
    result = service.isAuthenticated();
    expect(result).toBeTruthy();
  });

  it('should log in', fakeAsync(() => {
    const mockResponse = { userName: 'user', token: 'token' };
    const service = TestBed.inject(AuthenticationService);
    service.login('username', 'password').subscribe(() => {
      const result = JSON.parse(localStorage.getItem('currentUser'));
      expect(result.userName).toEqual('user');
      expect(result.token).toEqual('token');
    });
    const request = http.expectOne(
      service.macrologBackendUrl + '/authenticate'
    );
    expect(request.request.method).toEqual('POST');
    request.flush(mockResponse);
    tick();
    http.verify();
  }));

  it('should not log in', fakeAsync(() => {
    const mockResponse = { somethingElse: 'test' };
    const service = TestBed.inject(AuthenticationService);
    service.login('username', 'password').subscribe(() => {
      const result = localStorage.getItem('currentUser');
      expect(result).toEqual(null);
    });
    const request = http.expectOne(
      service.macrologBackendUrl + '/authenticate'
    );
    expect(request.request.method).toEqual('POST');
    request.flush(mockResponse);
    tick();
    http.verify();
  }));

  it('should change password', () => {
    const mockResponse = { status: 200 };
    const service = TestBed.inject(AuthenticationService);
    service.changePassword('test', 'test2', 'test2').subscribe((res) => {
      expect(res.status).toEqual(200);
    });
    const request = http.expectOne(
      service.macrologBackendUrl + '/changePassword'
    );
    expect(request.request.method).toEqual('POST');
    request.flush(mockResponse);
  });

  it('should log out', fakeAsync(() => {
    const service = TestBed.inject(AuthenticationService);
    localStorage.setItem(
      'currentUser',
      JSON.stringify({ userName: 'username' })
    );
    service.logout();
    tick();
    const result = localStorage.getItem('currentUser');
    expect(result).toEqual(null);
  }));

  it('should register', () => {
    const mockResponse = { status: 200 };
    const service = TestBed.inject(AuthenticationService);
    service
      .register('username', 'email@email.com', 'password')
      .subscribe((res: any) => {
        expect(res.status).toEqual(200);
      });
    const request = http.expectOne(service.macrologBackendUrl + '/signup');
    expect(request.request.method).toEqual('POST');
    request.flush(mockResponse);
  });

  it('should reset password', () => {
    const mockResponse = { status: 200 };
    const service = TestBed.inject(AuthenticationService);
    service.resetPassword('email@email.com').subscribe((res: any) => {
      expect(res.status).toEqual(200);
    });
    const request = http.expectOne(
      service.macrologBackendUrl + '/resetPassword'
    );
    expect(request.request.method).toEqual('POST');
    request.flush(mockResponse);
  });

  it('should delete account', fakeAsync(() => {
    let mockResponse = { status: 200 };
    const service = TestBed.inject(AuthenticationService);
    service.deleteAccount('password').subscribe((res: any) => {
      expect(res.status).toEqual(200);
    });
    let request = http.expectOne(
      service.macrologBackendUrl + '/deleteAccount?password=password'
    );
    expect(request.request.method).toEqual('POST');
    request.flush(mockResponse);

    service.deleteAccount('password').subscribe(
      () => { },
      (err) => {
        expect(err.status).toEqual(401);
      }
    );
    mockResponse = { status: 401 };
    request = http.expectOne(
      service.macrologBackendUrl + '/deleteAccount?password=password'
    );
    request.flush(mockResponse);
  }));
});
