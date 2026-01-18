import { HttpClient } from '@angular/common/http';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  ComponentFixture,
  TestBed
} from '@angular/core/testing';
import { ActivatedRoute, provideRouter } from '@angular/router';
import { MockProvider } from 'ng-mocks';
import { of } from 'rxjs';
import { ToastService } from 'src/app/shared/services/toast.service';
import { UserService } from 'src/app/shared/services/user.service';
import { ConnectivityComponent } from './connectivity.component';
import { StravaSyncedAccount } from 'src/app/shared/model/stravaSynchedAccount';

describe('ConnectivityComponent', () => {
  let component: ConnectivityComponent;
  let fixture: ComponentFixture<ConnectivityComponent>;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ConnectivityComponent],
      providers: [
        provideRouter([]),
        MockProvider(ToastService),
        MockProvider(UserService),
        MockProvider(HttpClient)
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    fixture = TestBed.createComponent(ConnectivityComponent);
    component = fixture.componentInstance;
    userService = TestBed.inject(UserService);
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should create connectivity component', () => {
    expect(component).toBeTruthy();
  });

  it('should init connectivity component succesful', () => {
    const result = { id: 42, syncedApplicationId: 43 } as unknown as StravaSyncedAccount;
    spyOn(userService, 'getSyncSettings').and.returnValue(of(result));
    component.ngOnInit();
    expect(userService.getSyncSettings).toHaveBeenCalledWith('STRAVA');
    expect(component.syncError).toEqual('');
    expect(component.stravaConnectUrl).toEqual(
      'https://www.strava.com/oauth/authorize?approval_prompt=force&scope=activity:read_all&response_type=code&state=STRAVACONNECT&client_id=43&redirect_uri=http://localhost:4200/dashboard/user/connectivity'
    );
  });

  it('should init connectivity component with code and bad scope', () => {
    const route = TestBed.inject(ActivatedRoute);
    route.queryParams = of({ code: 123, scope: 'badscope' });

    const result = { id: 42, syncedApplicationId: 43 } as unknown as StravaSyncedAccount;
    spyOn(userService, 'getSyncSettings').and.returnValue(of(result));
    component.ngOnInit();

    expect(userService.getSyncSettings).toHaveBeenCalledWith('STRAVA');
    expect(component.syncError).toEqual(
      'Please give access to view your activitities in order to allow Macrolog to read your Strava activities'
    );
  });

  it('should init connectivity component with code and good scope', () => {
    const route = TestBed.inject(ActivatedRoute);
    route.queryParams = of({ code: '123', scope: 'read,activity:read_all' });

    const result = { id: 42, syncedApplicationId: 43 } as unknown as StravaSyncedAccount;
    spyOn(userService, 'getSyncSettings').and.returnValue(of(result));
    spyOn(userService, 'storeSyncSettings').and.returnValue(of(result));
    component.ngOnInit();

    expect(userService.getSyncSettings).toHaveBeenCalledWith('STRAVA');
    expect(userService.storeSyncSettings).toHaveBeenCalledWith('STRAVA', '123');
  });

  it('should disconnect from platform', () => {
    const result = { id: 42, syncedApplicationId: 43 } as unknown as StravaSyncedAccount;
    spyOn(userService, 'getSyncSettings').and.returnValue(of(result));
    spyOn(userService, 'disconnectSyncSettings').and.returnValue(
      of(undefined)
    );
    component.disconnect();
    expect(userService.disconnectSyncSettings).toHaveBeenCalledWith('STRAVA');
  });
});
