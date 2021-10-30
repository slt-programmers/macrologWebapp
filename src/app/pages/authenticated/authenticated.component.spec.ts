import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticatedComponent } from './authenticated.component';
import { ScrollBehaviourService } from '../../shared/services/scroll-behaviour.service';
import { HealthcheckService } from '../../shared/services/healthcheck.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from 'src/app/shared/components/navigation/navigation.component';
import { MockComponent, MockProvider } from 'ng-mocks';
import { AuthenticationService } from 'src/app/shared/services/auth.service';

describe('AuthenticatedComponent', () => {
  let component: AuthenticatedComponent;
  let fixture: ComponentFixture<AuthenticatedComponent>;
  let healthcheckService: HealthcheckService;
  let scrollBehaviourService: ScrollBehaviourService;
  let authService: AuthenticationService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'user', redirectTo: '' }])
      ],
      declarations: [
        AuthenticatedComponent,
        MockComponent(NavigationComponent)],
      providers: [
        MockProvider(HealthcheckService),
        MockProvider(ScrollBehaviourService),
        MockProvider(AuthenticationService),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AuthenticatedComponent);
    component = fixture.componentInstance;
    healthcheckService = TestBed.inject(HealthcheckService);
    scrollBehaviourService = TestBed.inject(ScrollBehaviourService);
    authService = TestBed.inject(AuthenticationService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create authenticated component', () => {
    expect(component).toBeTruthy();
  });

  it('should init the app component', fakeAsync(() => {
    const healthSpy = spyOn(healthcheckService, 'checkState').and.returnValue(
      of(true)
    );
    let result = component.stillSleeping();
    expect(result).toBeTruthy();
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    expect(healthcheckService.checkState).toHaveBeenCalled();
    result = component.stillSleeping();
    expect(result).toBeFalsy();

    healthSpy.and.returnValue(throwError({ status: 403 }));
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    result = component.stillSleeping();
    expect(result).toBeFalsy();

    component = TestBed.createComponent(AuthenticatedComponent).componentInstance;
    result = component.stillSleeping();
    expect(result).toBeTruthy();
    healthSpy.and.returnValue(throwError({ status: 404 }));
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    result = component.stillSleeping();
    expect(result).toBeTruthy();
  }));

  it('should open menu', () => {
    spyOn(scrollBehaviourService, 'preventScrolling');
    component.smallMenuOpen = false;
    component.openMenu();
    expect(component.smallMenuOpen).toBeTruthy();

    component.openMenu();
    expect(component.smallMenuOpen).toBeFalsy();
  });

  it('should close menu', () => {
    spyOn(scrollBehaviourService, 'preventScrolling');
    component.smallMenuOpen = true;
    component.closeMenu();
    expect(component.smallMenuOpen).toBeFalsy();
  });

  it('should determine if admin', () => {
    let authspy = spyOn(authService, 'isAdmin')
    authspy.and.returnValue(false);
    let result = component.isAdmin();
    expect(result).toBeFalse();

    authspy.and.returnValue(true);
    result = component.isAdmin();
    expect(result).toBeTrue();
  });

  it('should log user out', () => {
    spyOn(router, 'navigate');
    spyOn(scrollBehaviourService, 'preventScrolling');
    spyOn(authService, 'logout');
    component.smallMenuOpen = true;

    component.logOut();
    expect(router.navigate).toHaveBeenCalledWith(['']);
    expect(scrollBehaviourService.preventScrolling).toHaveBeenCalledWith(false);
    expect(authService.logout).toHaveBeenCalled();
    expect(component.smallMenuOpen).toBeFalse();
  });
});
