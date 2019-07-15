import { async, ComponentFixture, TestBed, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginComponent } from './login.component';
import { AuthenticationService } from '@app/services/auth.service';
import { ToastService } from '@app/services/toast.service';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { of, throwError, Observable } from 'rxjs';

describe('LoginComponent', () => {
	let component: LoginComponent;
	let fixture: ComponentFixture<LoginComponent>;
	let authService: AuthenticationService;
	let router: Router;

	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [LoginComponent],
			providers: [AuthenticationService, ToastService, HttpClient, HttpHandler],
			imports: [FormsModule, BrowserAnimationsModule, RouterTestingModule.withRoutes([])],
			schemas: [CUSTOM_ELEMENTS_SCHEMA]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LoginComponent);
		component = fixture.componentInstance;
		authService = TestBed.get(AuthenticationService);
		router = TestBed.get(Router);
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});

	it('should toggle login and about content', () => {
		let result = component.showContentLogin;
		expect(result).toBeTruthy();

		// manipulate function directly
		component.toggleLogin(false);
		result = component.showContentLogin;
		expect(result).toBeFalsy();

		// test dom element click login
		let paragraphElem = fixture.debugElement.query(By.css('#login'));
		paragraphElem.nativeElement.click()
		fixture.detectChanges();

		result = component.showContentLogin;
		expect(result).toBeTruthy();

		// test dom element click about
		paragraphElem = fixture.debugElement.query(By.css('#about'));
		paragraphElem.nativeElement.click();
		fixture.detectChanges();

		result = component.showContentLogin;
		expect(result).toBeFalsy();
	});

	it('should log in', () => {
		let loginSpy = spyOn(authService, 'login').and.returnValue(of());
		let consoleSpy = spyOn(console, 'log');
		component.usernameOrEmail = 'username';
		component.password = 'password';

		const loginButton = fixture.debugElement.query(By.css('#loginBtn'));
		loginButton.nativeElement.click();
		fixture.detectChanges();

		expect(authService.login).toHaveBeenCalledWith('username', 'password');
		expect(component.loginError).toEqual('');
		
		loginSpy.and.returnValue(throwError({status: 404}));
		loginButton.nativeElement.click();
		fixture.detectChanges();
		expect(authService.login).toHaveBeenCalledWith('username', 'password');
		expect(consoleSpy).toHaveBeenCalled();
		expect(component.loginError).toEqual('Username or password incorrect');

	});



});
