import {
  TestBed,
  ComponentFixture,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ConnectivityComponent } from './connectivity.component';
import { of } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';

describe('ConnectivityComponent', () => {
  let component: ConnectivityComponent;
  let fixture: ComponentFixture<ConnectivityComponent>;
  let toastService: ToastService;
  let userService: UserService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([])],
      declarations: [ConnectivityComponent],
      providers: [ToastService, UserService, HttpClient, HttpHandler],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(ConnectivityComponent);
    component = fixture.componentInstance;
    toastService = TestBed.inject(ToastService);
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create connectivity component', () => {
    expect(component).toBeTruthy();
  });

  it('should init connectivity component succesful', fakeAsync(() => {
    const result = { id: 42, syncedApplicationId: 43 };
    spyOn(userService, 'getSyncSettings').and.returnValue(of(result));
    component.ngOnInit();
    expect(userService.getSyncSettings).toHaveBeenCalledWith('STRAVA');
    tick();
    expect(component.syncError).toEqual('');
    expect(component.stravaConnectUrl).toEqual(
      'http://www.strava.com/oauth/authorize?approval_prompt=force&scope=activity:read_all&response_type=code&state=STRAVACONNECT&client_id=43&redirect_uri=https://localhost:4200/dashboard/user/connectivity'
    );
  }));

  it('should init connectivity component with code and bad scope', fakeAsync(() => {
    const route = TestBed.inject(ActivatedRoute);
    route.queryParams = of({ code: 123, scope: 'badscope' });

    const result = { id: 42, syncedApplicationId: 43 };
    spyOn(userService, 'getSyncSettings').and.returnValue(of(result));
    component.ngOnInit();

    expect(userService.getSyncSettings).toHaveBeenCalledWith('STRAVA');
    tick();
    expect(component.syncError).toEqual(
      'Please give access to view your activitities in order to allow Macrolog to read your Strava activities'
    );
  }));

  it('should init connectivity component with code and good scope', fakeAsync(() => {
    const route = TestBed.inject(ActivatedRoute);
    route.queryParams = of({ code: '123', scope: 'read,activity:read_all' });

    const result = { id: 42, syncedApplicationId: 43 };
    spyOn(userService, 'getSyncSettings').and.returnValue(of(result));
    spyOn(userService, 'storeSyncSettings').and.returnValue(
      of({ status: 200 })
    );
    component.ngOnInit();

    expect(userService.getSyncSettings).toHaveBeenCalledWith('STRAVA');
    tick();
    expect(userService.storeSyncSettings).toHaveBeenCalledWith('STRAVA', '123');
  }));

  it('should disconnect from platform', () => {
    spyOn(userService, 'getSyncSettings').and.returnValue(of({ status: 200 }));
    spyOn(userService, 'disconnectSyncSettings').and.returnValue(
      of({ status: 200 })
    );
    component.disconnect();
    expect(userService.disconnectSyncSettings).toHaveBeenCalledWith('STRAVA');
  });
});
