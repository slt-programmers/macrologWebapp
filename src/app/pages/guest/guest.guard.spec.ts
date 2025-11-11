import { TestBed } from '@angular/core/testing';
import { GuestGuard } from './guest.guard';
import { AuthenticationService } from '../../shared/services/auth.service';
import { provideRouter, Router } from '@angular/router';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('GuestGuardService', () => {
  let service: GuestGuard;
  let authService: AuthenticationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
    imports: [],
    providers: [
        GuestGuard,
        AuthenticationService,
        provideRouter([]),
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
    ]
});
    service = TestBed.inject(GuestGuard);
    authService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
  });

  it('should create service', () => {
    expect(service).toBeTruthy();
  });

  it('should check if guest', () => {
    spyOn(router, 'navigate');
    const authSpy = spyOn(authService, 'isAuthenticated').and.returnValue(true);
    let result = service.canActivate();
    expect(result).toBeFalsy();
    expect(router.navigate).toHaveBeenCalledWith(['dashboard']);

    authSpy.and.returnValue(false);
    result = service.canActivate();
    expect(result).toBeTruthy();
  });
});
