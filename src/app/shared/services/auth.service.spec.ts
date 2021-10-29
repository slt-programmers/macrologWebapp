import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthenticationService,
        MockProvider(HttpClient)],
    });
    http = TestBed.inject(HttpClient);
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
    expect(result).toBeFalse();
    localStorage.setItem(
      'currentUser',
      JSON.stringify({ userName: 'username', token: 'token' })
    );
    result = service.isAuthenticated();
    expect(result).toBeTrue();
  });

  it('should check if admin', () => {
    const service = TestBed.inject(AuthenticationService);
    let result = service.isAdmin();
    expect(result).toBeFalse();
    localStorage.setItem('currentUser', JSON.stringify({ admin: true }));
    result = service.isAdmin();
    expect(result).toBeTrue();
  })

  it('should log in', async () => {
    spyOn(http, 'post').and.returnValue(of({ token: 'token' }));
    const service = TestBed.inject(AuthenticationService);
    const result = await service.login('username', 'password').toPromise();
    expect(result).toEqual(undefined);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/api/authenticate', {
      username: 'username', password: 'password'
    });
    const user = localStorage.getItem('currentUser');
    expect(user).toEqual("{\"token\":\"token\"}");
  });

  it('should not log in', async () => {
    spyOn(http, 'post').and.returnValue(of({ notAToken: 'token' }));
    const service = TestBed.inject(AuthenticationService);
    const result = await service.login('username', 'password').toPromise();
    expect(result).toEqual(undefined);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/api/authenticate', {
      username: 'username', password: 'password'
    });
    const user = localStorage.getItem('currentUser');
    expect(user).toEqual(null);
  });

  it('should handle error on log in', async () => {
    spyOn(http, 'post').and.returnValue(throwError({ status: 404 }));
    const service = TestBed.inject(AuthenticationService);
    const result = await service.login('username', 'password').toPromise();
    expect(result).toEqual(undefined);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/api/authenticate', {
      username: 'username', password: 'password'
    });
    const user = localStorage.getItem('currentUser');
    expect(user).toEqual(null);
  });

  it('should change password', async () => {
    spyOn(http, 'post').and.returnValue(of({}));
    const service = TestBed.inject(AuthenticationService);
    const result = await service.changePassword('test', 'test2', 'test2').toPromise();
    expect(result).toEqual({});
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/api/changePassword', {
      oldPassword: 'test',
      newPassword: 'test2',
      confirmPassword: 'test2'
    });
  });

  it('should handle error on change password', async () => {
    spyOn(http, 'post').and.returnValue(throwError({ status: 404 }));
    const service = TestBed.inject(AuthenticationService);
    const result = await service.changePassword('test', 'test2', 'test2').toPromise();
    expect(result).toEqual(undefined);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/api/changePassword', {
      oldPassword: 'test',
      newPassword: 'test2',
      confirmPassword: 'test2'
    });
  });

  it('should log out', async () => {
    const service = TestBed.inject(AuthenticationService);
    localStorage.setItem('currentUser', JSON.stringify({ userName: 'username' }));
    service.logout();
    const result = localStorage.getItem('currentUser');
    expect(result).toEqual(null);
  });

  it('should register', async () => {
    spyOn(http, 'post').and.returnValue(of({}));
    const service = TestBed.inject(AuthenticationService);
    const result = await service.register('username', 'email@email.com', 'password').toPromise();
    expect(result).toEqual({});
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/api/signup', {
      username: 'username', email: 'email@email.com', password: 'password'
    });
  });

  it('should handle error on register', async () => {
    spyOn(http, 'post').and.returnValue(throwError({ status: 404 }));
    const service = TestBed.inject(AuthenticationService);
    const result = await service.register('username', 'email@email.com', 'password').toPromise();
    expect(result).toEqual(undefined);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/api/signup', {
      username: 'username', email: 'email@email.com', password: 'password'
    });
  });

  it('should reset password', async () => {
    spyOn(http, 'post').and.returnValue(of({}));
    const service = TestBed.inject(AuthenticationService);
    const result = await service.resetPassword('email@email.com').toPromise();
    expect(result).toEqual({});
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/api/resetPassword', {
      email: 'email@email.com'
    });
  });

  it('should handle error on reset password', async () => {
    spyOn(http, 'post').and.returnValue(throwError({ status: 404 }));
    const service = TestBed.inject(AuthenticationService);
    const result = await service.resetPassword('email@email.com').toPromise();
    expect(result).toEqual(undefined);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/api/resetPassword', {
      email: 'email@email.com'
    });
  });

  it('should delete account', async () => {
    spyOn(http, 'post').and.returnValue(of({}));
    const service = TestBed.inject(AuthenticationService);
    const result = await service.deleteAccount('password').toPromise();
    expect(result).toEqual({});
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/api/deleteAccount', null,
      {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': environment.origin },
        params: { password: 'password' }
      }
    );
  });

  it('should handle error on delete account', async () => {
    spyOn(http, 'post').and.returnValue(throwError({status: 404}));
    const service = TestBed.inject(AuthenticationService);
    const result = await service.deleteAccount('password').toPromise();
    expect(result).toEqual(undefined);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/api/deleteAccount', null,
      {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': environment.origin },
        params: { password: 'password' }
      }
    );
  });  

});
