import {
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { provideRouter, Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { AuthenticationService } from 'src/app/shared/services/auth.service';
import { ToastService } from 'src/app/shared/services/toast.service';
import { NavigationComponent } from 'src/app/shared/components/navigation/navigation.component';
import { MockComponent, MockProvider } from 'ng-mocks';
import { ModalComponent } from 'src/app/shared/components/modal/modal.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthenticationService;
  let toastService: ToastService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [FormsModule, ReactiveFormsModule, LoginComponent,
        MockComponent(NavigationComponent),
        MockComponent(ModalComponent)],
    providers: [
        MockProvider(AuthenticationService),
        MockProvider(ToastService),
        provideRouter([])
    ]
}).compileComponents();
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthenticationService);
    toastService = TestBed.inject(ToastService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should log in', () => {
    spyOn(authService, 'login').and.returnValue(of(undefined));
    spyOn(router, 'navigate');

    component.login();
    expect(authService.login).not.toHaveBeenCalled();

    component.loginForm.patchValue({
      username: 'username',
      password: 'password'
    });
    component.login();
    expect(authService.login).toHaveBeenCalledWith('username', 'password');
    expect(router.navigate).toHaveBeenCalledWith(['dashboard']);
    expect(component.loginError).toEqual('');
  });

  it('should error on log in', () => {
    spyOn(authService, 'login').and.returnValue(throwError({status: 500}));
    spyOn(router, 'navigate');
    component.loginForm.patchValue({
      username: 'username',
      password: 'password'
    });
    component.login();
    expect(router.navigate).not.toHaveBeenCalledWith(['dashboard']);
    expect(component.loginError).toEqual('Username or password incorrect');
  });

  it('should register new user', () => {
    spyOn(authService, 'register').and.returnValue(of({}));
    spyOn(authService, 'login').and.returnValue(of(undefined));
    spyOn(router, 'navigate');

    component.register();
    expect(authService.register).not.toHaveBeenCalled();

    component.registerForm.patchValue({
      username: 'name',
      email: 'email@email.com',
      password: 'secret'
    });
    component.register();

    expect(router.navigate).toHaveBeenCalledWith(['dashboard', 'onboarding']);
  });

  it('should error on register', () => {
    spyOn(authService, 'register').and.returnValue(throwError({ status: 500 }));
    spyOn(router, 'navigate');
    component.registerForm.patchValue({
      username: 'name',
      email: 'email@email.com',
      password: 'secret'
    });
    component.register();
    expect(router.navigate).not.toHaveBeenCalledWith(['dashboard', 'onboarding']);
    expect(component.registerError).toEqual('Unknown error during registration.');
  });

  it('should error on register', () => {
    spyOn(authService, 'register').and.returnValue(throwError({ status: 401, error: 'Some other error' }));
    spyOn(router, 'navigate');
    component.registerForm.patchValue({
      username: 'name',
      email: 'email@email.com',
      password: 'secret'
    });
    component.register();
    expect(router.navigate).not.toHaveBeenCalledWith(['dashboard', 'onboarding']);
    expect(component.registerError).toEqual('Unknown error during registration.');
  });

  it('should error on register if account allready exists', () => {
    spyOn(authService, 'register').and.returnValue(throwError({ status: 401, error: 'Username or email already in use' }));
    spyOn(router, 'navigate');
    component.registerForm.patchValue({
      username: 'name',
      email: 'email@email.com',
      password: 'secret'
    });
    component.register();
    expect(router.navigate).not.toHaveBeenCalledWith(['dashboard', 'onboarding']);
    expect(component.registerError).toEqual('Username or email is already in use. Please try a different username or use \'Forgot password\' to retrieve a new password.');
  });

  it('should toggle forgot password modal', () => {
    const forgotLink = fixture.debugElement.query(By.css('#forgotLink'));
    expect(component.showForgotPwModal).toBeFalsy();
    forgotLink.nativeElement.click();
    fixture.detectChanges();
    expect(component.showForgotPwModal).toBeTruthy();
  });

  it('should reset password', fakeAsync(() => {
    const resetSpy = spyOn(authService, 'resetPassword').and.returnValue(
      of({})
    );
    spyOn(toastService, 'setMessage');
    component.forgotError = 'error';
    component.forgotEmail = 'email@email.com';

    const forgotLink = fixture.debugElement.query(By.css('#forgotLink'));
    forgotLink.nativeElement.click();
    fixture.detectChanges();

    let resetBtn = fixture.debugElement.query(By.css('#resetBtn'));
    resetBtn.nativeElement.click();
    expect(resetSpy).toHaveBeenCalledWith('email@email.com');
    expect(component.forgotError).toEqual('');
    tick();
    fixture.detectChanges();
    expect(toastService.setMessage).toHaveBeenCalled();
    expect(component.showForgotPwModal).toBeFalsy();

    resetSpy.and.returnValue(throwError({ status: 404 }));
    forgotLink.nativeElement.click();
    fixture.detectChanges();
    resetBtn = fixture.debugElement.query(By.css('#resetBtn'));
    // the button was gone when the model was closed
    resetBtn.nativeElement.click();
    tick();
    fixture.detectChanges();
    expect(component.forgotError).toEqual('The email adress was not found');
  }));
});
