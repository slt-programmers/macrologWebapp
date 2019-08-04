import { TestBed, async, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { HttpHandler, HttpClient } from '@angular/common/http';
import { ScrollBehaviourService } from './services/scroll-behaviour.service';
import { HealthcheckService } from './services/healthcheck.service';
import { of, throwError } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let healthcheckService: HealthcheckService;
  let scrollBehaviourService: ScrollBehaviourService;
  let router: Router;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'user', redirectTo: '' }])],
      declarations: [AppComponent],
      providers: [HealthcheckService, HttpClient, HttpHandler, ScrollBehaviourService],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
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

    component = TestBed.createComponent(AppComponent).componentInstance;
    result = component.stillSleeping();
    expect(result).toBeTruthy();
    healthSpy.and.returnValue(throwError({ status: 404 }));
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    result = component.stillSleeping();
    expect(result).toBeTruthy();
  }));

  it('should open navigation', fakeAsync(() => {
    spyOn(scrollBehaviourService, 'preventScrolling');
    localStorage.setItem('currentUser', '{"user": "Test"}')
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    component.ngAfterViewInit();
    const hamburgerMenu = fixture.debugElement.query(By.css('#hamburger'));
    hamburgerMenu.nativeElement.click()
    expect(scrollBehaviourService.preventScrolling).toHaveBeenCalledWith(true);
  }));

  it('should close navigation', fakeAsync(() => {
    spyOn(scrollBehaviourService, 'preventScrolling');
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    component.ngAfterViewInit();
    const navBackdrop = fixture.debugElement.query(By.css('#navBackdrop'));
    navBackdrop.nativeElement.click()
    expect(scrollBehaviourService.preventScrolling).toHaveBeenCalledWith(false);
    expect(component.title).toEqual('');
  }));

  it('should set title', fakeAsync(() => {
    spyOn(router, 'navigate');
    localStorage.setItem('currentUser', '{"user": "Test"}')
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    component.ngAfterViewInit();
    const menuItem = fixture.debugElement.query(By.css('#usermenuProfileItem'));
    menuItem.nativeElement.click()
    expect(component.title).toEqual('Profile');
    component.setTitle(undefined);
    expect(component.title).toEqual('Profile');
  }));

  it('should get username', () => {
    let result = component.getUsername();
    expect(result).toEqual('Guest');
    localStorage.setItem('currentUser', '{"userName": "Test"}');
    result = component.getUsername();
    expect(result).toEqual('Test');
  });

  it('should check if logged in', fakeAsync(() => {
    let header = fixture.debugElement.query(By.css('#header'));
    let usermenu = fixture.debugElement.query(By.css('#usermenu'));
    let nav = fixture.debugElement.query(By.css('#nav'));
    expect(header).toEqual(null);
    expect(usermenu).toEqual(null);
    expect(nav).toEqual(null);

    localStorage.setItem('currentUser', '{"user": "Test"}')
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    component.ngAfterViewInit();
    header = fixture.debugElement.query(By.css('#header'));
    usermenu = fixture.debugElement.query(By.css('#usermenu'));
    nav = fixture.debugElement.query(By.css('#nav'));

    expect(header).not.toEqual(null);
    expect(usermenu).not.toEqual(null);
    expect(nav).not.toEqual(null);
  }));

  it('should determine if admin', () => {
    let result = component.isAdmin();
    expect(result).toBeFalsy();
    localStorage.setItem('currentUser', '{"user": "Carmen", "admin": "true"}');
    result = component.isAdmin();
    expect(result).toBeTruthy();
  })

  it('should open usermenu', fakeAsync(() => {
    spyOn(scrollBehaviourService, 'preventScrolling');
    localStorage.setItem('currentUser', '{"user": "Test"}')
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    component.ngAfterViewInit();
    const usermenu = fixture.debugElement.query(By.css('#usermenuCircle'));
    usermenu.nativeElement.click()
    expect(scrollBehaviourService.preventScrolling).toHaveBeenCalledWith(true);
  }));

  it('should close navigation', fakeAsync(() => {
    spyOn(scrollBehaviourService, 'preventScrolling');
    component.ngOnInit();
    tick();
    fixture.detectChanges();
    component.ngAfterViewInit();
    const userBackdrop = fixture.debugElement.query(By.css('#userBackdrop'));
    userBackdrop.nativeElement.click()
    expect(scrollBehaviourService.preventScrolling).toHaveBeenCalledWith(false);
    expect(component.title).toEqual('');
  }));

});
