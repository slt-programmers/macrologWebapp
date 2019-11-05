import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { AccountComponent } from './account.component';
import { AuthenticationService } from '@app/services/auth.service';
import { throwError, of } from 'rxjs';

import { FormsModule } from '@angular/forms';
import { ToastService } from '@app/services/toast.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let authService: AuthenticationService;
  let toastService: ToastService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, RouterTestingModule],
      declarations: [AccountComponent],
      providers: [AuthenticationService, ToastService, HttpClient, HttpHandler],
      schemas: [NO_ERRORS_SCHEMA, CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountComponent);
    component = fixture.componentInstance;
    authService = TestBed.get(AuthenticationService);
    toastService = TestBed.get(ToastService);
    router = TestBed.get(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create account component', () => {
    expect(component).toBeTruthy();
  });

  it('should change password', fakeAsync(() => {
    component.newPassword = 'newpw';
    component.confirmPassword = 'notnewpw';
    component.changePassword();
    tick();
    expect(component.message).toEqual('The confirmation password does not match with the new password.');

    component.confirmPassword = 'newpw';
    const authSpy = spyOn(authService, 'changePassword').and.returnValue(throwError({ status: 400, error: 'passwords do not match' }));
    component.changePassword();
    tick();
    expect(component.message).toEqual('The confirmation password does not match with the new password.');

    authSpy.and.returnValue(throwError({ status: 401 }));
    component.changePassword();
    tick();
    expect(component.message).toEqual('Password invalid');

    authSpy.and.returnValue(of({ status: 200 }));
    spyOn(toastService, 'setMessage');
    component.changePassword();
    tick();
    expect(toastService.setMessage).toHaveBeenCalledWith('Your password has changed');
    expect(component.oldPassword).toEqual('');
    expect(component.newPassword).toEqual('');
    expect(component.confirmPassword).toEqual('');
  }));

  it('should delete account', fakeAsync(() => {
    const authSpy = spyOn(authService, 'deleteAccount').and.returnValue(of({ status: 200 }));
    spyOn(router, 'navigate');
    localStorage.setItem('currentUser', 'user');
    component.password = 'password';
    component.deleteAccount();
    expect(authService.deleteAccount).toHaveBeenCalledWith('password');
    tick();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
    expect(localStorage.getItem('currentUser')).toBeNull();

    authSpy.and.returnValue(throwError({status: 401}));
    localStorage.setItem('currentUser', 'user');
    component.deleteAccount();
    expect(authService.deleteAccount).toHaveBeenCalledWith('password');
    tick();
    expect(localStorage.getItem('currentUser')).toEqual('user');
    expect(component.errorMessage).toEqual('Password is incorrect');
  }));
});
