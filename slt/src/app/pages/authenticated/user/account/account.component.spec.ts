import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastService } from '@app/services/toast.service';
import { UserService } from '@app/services/user.service';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Router } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { AccountComponent } from './account.component';
import { AuthenticationService } from '@app/services/auth.service';
import { AuthGuardService } from '@app/services/auth-guard.service';

describe('AccountComponent', () => {
  let component: AccountComponent;
  let fixture: ComponentFixture<AccountComponent>;
  let toastService: ToastService;
  let authService: AuthenticationService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [AccountComponent],
      providers: [AuthenticationService, ToastService, UserService, HttpClient, HttpHandler],
      schemas: [NO_ERRORS_SCHEMA]
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
  })

  it('should create account component', () => {
    expect(component).toBeTruthy();
  });

  it('should change password', fakeAsync(() => {
    component.newPassword = 'newpw';
    component.confirmPassword = 'notnewpw';
    component.changePassword();
    expect(component.message).toEqual('The confirmation password does not match with the new password.');

    component.confirmPassword = 'newpw';
    spyOn(authService, 'changePassword').and.th

  }));

	// public changePassword() {

	// 		this.authService.changePassword(this.oldPassword, this.newPassword, this.confirmPassword)
	// 			.subscribe(
	// 				data => {
	// 					if (data.status === 400 && data.error === 'passwords do not match') {
	// 						this.message = 'The confirmation password does not match with the new password.';
	// 					} else if (data.status === 200) {
	// 						this.toastService.setMessage('Your password has changed');
	// 						this.oldPassword = '';
	// 						this.newPassword = '';
	// 						this.confirmPassword = '';
	// 					}
	// 				},
	// 				error => {
	// 					if (error.status === 401) {
	// 						this.message = 'Password invalid';
	// 					}
	
	// }


});
