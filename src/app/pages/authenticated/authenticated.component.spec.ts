import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthenticatedComponent } from './authenticated.component';
import { HttpHandler, HttpClient } from '@angular/common/http';
import { ScrollBehaviourService } from '../../shared/services/scroll-behaviour.service';
import { HealthcheckService } from '../../shared/services/healthcheck.service';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Renderer2 } from '@angular/core';
import { ToastService } from 'src/app/shared/services/toast.service';

describe('AuthenticatedComponent', () => {
  let component: AuthenticatedComponent;
  let fixture: ComponentFixture<AuthenticatedComponent>;
  let healthcheckService: HealthcheckService;
  let scrollBehaviourService: ScrollBehaviourService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([{ path: 'user', redirectTo: '' }]),
        BrowserAnimationsModule,
      ],
      declarations: [AuthenticatedComponent],
      providers: [
        HealthcheckService,
        HttpClient,
        HttpHandler,
        ScrollBehaviourService,
        Renderer2,
        ToastService,
      ],
    }).compileComponents();
    fixture = TestBed.createComponent(AuthenticatedComponent);
    component = fixture.componentInstance;
    healthcheckService = TestBed.inject(HealthcheckService);
    scrollBehaviourService = TestBed.inject(ScrollBehaviourService);
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

    component = TestBed.createComponent(AuthenticatedComponent)
      .componentInstance;
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
    let result = component.isAdmin();
    expect(result).toBeFalsy();
    localStorage.setItem(
      'currentUser',
      JSON.stringify({ user: 'Carmen', admin: 'true' })
    );
    result = component.isAdmin();
    expect(result).toBeTruthy();
  });
});
