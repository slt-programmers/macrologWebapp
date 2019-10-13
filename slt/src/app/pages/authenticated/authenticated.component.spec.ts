import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticatedComponent } from './authenticated.component';
import { HttpHandler, HttpClient } from '@angular/common/http';
import { ScrollBehaviourService } from '../../services/scroll-behaviour.service';
import { HealthcheckService } from '../../services/healthcheck.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('AuthenticatedComponent', () => {
  let component: AuthenticatedComponent;
  let fixture: ComponentFixture<AuthenticatedComponent>;
  let healthcheckService: HealthcheckService;
  let scrollBehaviourService: ScrollBehaviourService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user', redirectTo: '' }]), BrowserAnimationsModule],
      declarations: [AuthenticatedComponent],
      providers: [HealthcheckService, HttpClient, HttpHandler, ScrollBehaviourService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticatedComponent);
    component = fixture.componentInstance;
    healthcheckService = TestBed.get(HealthcheckService);
    scrollBehaviourService = TestBed.get(ScrollBehaviourService);
    router = TestBed.get(Router);
  });

  afterEach(() => {
    localStorage.clear();
  })

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should init the app component', fakeAsync(() => {
    const healthSpy = spyOn(healthcheckService, 'checkState').and.returnValue(of(true));
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
    spyOn(scrollBehaviourService, 'preventScrolling')
    component.smallMenuOpen = false;
    component.openMenu();
    expect(component.smallMenuOpen).toBeTruthy();

    component.openMenu();
    expect(component.smallMenuOpen).toBeFalsy();
  });

  it('should close menu', () => {
    spyOn(scrollBehaviourService, 'preventScrolling')
    component.smallMenuOpen= true;
    component.closeMenu();
    expect(component.smallMenuOpen).toBeFalsy();
  })

  it('should determine if admin', () => {
    let result = component.isAdmin();
    expect(result).toBeFalsy();
    localStorage.setItem('currentUser', '{"user": "Carmen", "admin": "true"}');
    result = component.isAdmin();
    expect(result).toBeTruthy();
  });

});
