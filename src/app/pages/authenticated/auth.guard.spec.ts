import { TestBed } from '@angular/core/testing';
import { AuthenticationService } from '../../shared/services/auth.service';
import { AuthGuard } from './auth.guard';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { MockProvider } from 'ng-mocks';
import { HttpClient } from '@angular/common/http';

describe('AuthGuardService', () => {
  let authService: AuthenticationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      providers: [AuthGuard,
        MockProvider(AuthenticationService),
        MockProvider(HttpClient)],
    });
    authService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
  });

  it('should check if authorized to navigate', () => {
    const service = TestBed.inject(AuthGuard);
    spyOn(router, 'navigate');

    let result = service.canActivate();
    expect(router.navigate).toHaveBeenCalledWith(['']);
    expect(result).toBeFalsy();

    spyOn(authService, 'isAuthenticated').and.returnValue(true);
    result = service.canActivate();
    expect(result).toBeTruthy();
  });
});
