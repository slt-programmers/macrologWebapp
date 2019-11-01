import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthenticationService } from './auth.service';
import { AuthGuardService } from './auth-guard.service';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

describe('AuthGuardService', () => {
    let authService: AuthenticationService;
    let router: Router;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
            providers: [AuthGuardService, AuthenticationService]
        });
        authService = TestBed.get(AuthenticationService);
        router = TestBed.get(Router);
    });

    it('should check if authorized to navigate', () => {
        const service = TestBed.get(AuthGuardService);
        spyOn(router, 'navigate');

        let result = service.canActivate();
        expect(router.navigate).toHaveBeenCalledWith(['/']);
        expect(result).toBeFalsy();

        spyOn(authService, 'isAuthenticated').and.returnValue(true);
        result = service.canActivate();
        expect(result).toBeTruthy();
    });

});
