import { TestBed } from '@angular/core/testing';
import { GuestGuardService } from './guest-guard.service';
import { AuthenticationService } from './auth.service';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('GuestGuardService', () => {
  let service: GuestGuardService;
  let authService: AuthenticationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GuestGuardService, AuthenticationService],
      imports: [RouterTestingModule, HttpClientTestingModule],
    });
    service = TestBed.inject(GuestGuardService);
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
    expect(router.navigate).toHaveBeenCalledWith(['/log']);

    authSpy.and.returnValue(false);
    result = service.canActivate();
    expect(result).toBeTruthy();
  });
});
