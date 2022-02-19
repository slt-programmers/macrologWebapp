import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticationService } from '../../services/auth.service';
import { NavigationComponent } from './navigation.component';
import { MockProvider } from 'node_modules/ng-mocks';
import { Router } from '@angular/router';

describe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  let authService: AuthenticationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NavigationComponent],
      providers: [
        MockProvider(AuthenticationService)]
    }).compileComponents();

    authService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should toggle menu', () => {
    expect(component.menuOpen).toBeFalse();
    component.toggleMenu();
    expect(component.menuOpen).toBeTrue();
  });

  it('should log out', () => {
    spyOn(authService, 'logout');
    spyOn(router, 'navigate');
    component.logOut();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should return admin', () => {
    spyOn(authService, 'isAdmin').and.returnValue(true);
    expect(component.isAdmin()).toBeTrue();
  });

});
