import { TestBed, fakeAsync, tick } from "@angular/core/testing";
import { AuthenticationService } from "./auth.service";
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { map } from "rxjs/operators";

describe('AuthService', () => {
    let http: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule],
            providers: [AuthenticationService]
        });
        http = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        localStorage.clear();
    })

    it('should create service', () => {
        const service = TestBed.get(AuthenticationService);
        expect(service).toBeTruthy();
    });

    it('should check if authenticated', () => {
        const service = TestBed.get(AuthenticationService);
        let result = service.isAuthenticated();
        expect(result).toBeFalsy();
        localStorage.setItem('currentUser', JSON.stringify({ 'user': 'username', 'token': 'token' }));
        result = service.isAuthenticated();
        expect(result).toBeTruthy();
    });

    it('should log in', fakeAsync(() => {
        const mockResponse = { name: 'user', token: 'token' };
        const service = TestBed.get(AuthenticationService);
        service.login('username', 'password').subscribe(
            res => {
                let result = JSON.parse(localStorage.getItem('currentUser'));
                expect(result.user).toEqual('user')
                expect(result.token).toEqual('token')
            }
        );
        const request = http.expectOne(service.macrologBackendUrl + '/authenticate');
        expect(request.request.method).toEqual('POST');
        request.flush(mockResponse);
        tick();
        http.verify();
    }));

    it('should not log in', fakeAsync(() => {
        const mockResponse = { somethingElse: 'test' };
        const service = TestBed.get(AuthenticationService);
        service.login('username', 'password').subscribe(
            res => {
                let result = localStorage.getItem('currentUser');
                expect(result).toEqual(null);
            }
        );
        const request = http.expectOne(service.macrologBackendUrl + '/authenticate');
        expect(request.request.method).toEqual('POST');
        request.flush(mockResponse);
        tick();
        http.verify();
    }));

    it('should change password', () => {
        const mockResponse = { status: 200 };
        const service = TestBed.get(AuthenticationService);
        service.changePassword('test', 'test2', 'test2').subscribe(res => {
            expect(res.status).toEqual(200);
        });
        const request = http.expectOne(service.macrologBackendUrl + '/changePassword');
        expect(request.request.method).toEqual('POST');
        request.flush(mockResponse);
    });

    it('should log out', fakeAsync(() => {
        const service = TestBed.get(AuthenticationService);
        localStorage.setItem('currentUser', JSON.stringify({ username: 'username' }))
        service.logout();
        tick();
        const result = localStorage.getItem('currentUser');
        expect(result).toEqual(null);
    }));

    it('should register', () => {
        const mockResponse = { status: 200 };
        const service = TestBed.get(AuthenticationService);
        service.register('username', 'email@email.com', 'password').subscribe(res => {
            expect(res.status).toEqual(200);
        });
        const request = http.expectOne(service.macrologBackendUrl + '/signup');
        expect(request.request.method).toEqual('POST');
        request.flush(mockResponse);
    });

    it('should reset password', () => {
        const mockResponse = { status: 200 };
        const service = TestBed.get(AuthenticationService);
        service.resetPassword('email@email.com').subscribe(res => {
            console.log('REST PASSWORD');
            console.log(res);
            expect(res.status).toEqual(200);
        });
        const request = http.expectOne(service.macrologBackendUrl + '/resetPassword');
        expect(request.request.method).toEqual('POST');
        request.flush(mockResponse);
    });
})