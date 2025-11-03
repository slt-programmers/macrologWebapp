import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { MockProvider } from 'ng-mocks';
import { of, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UserSettings } from '../model/userSettings';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserService,
        MockProvider(HttpClient),
      ],
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpClient);
  });

  it('should create', () => {
    expect(service).toBeTruthy();
  });

  it('should get settings', async () => {
    spyOn(http, 'get').and.returnValue(of('test'));
    const result = await service.getSetting('test', '2021-01-01').toPromise();
    expect(result).toEqual('test');
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/settings/test',
      { params: { date: '2021-01-01' } });
  });

  // it('should handle error on get settings', async () => {
  //   spyOn(http, 'get').and.returnValue(throwError({}));
  //   const result = await service.getSetting('test', '2021-01-01').toPromise();
  //   expect(result).toEqual(undefined);
  //   expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/settings/test',
  //     { params: { date: '2021-01-01' } });
  // });

  it('should get user settings', async () => {
    spyOn(http, 'get').and.returnValue(of({ name: 'tester' } as UserSettings));
    const result = await service.getUserSettings().toPromise();
    expect(result).toEqual({ name: 'tester' } as UserSettings);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/settings/user');
  });

  // it('should handle error on get user settings', async () => {
  //   spyOn(http, 'get').and.returnValue(throwError({}));
  //   const result = await service.getUserSettings().toPromise();
  //   expect(result).toEqual(undefined);
  //   expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/settings/user');
  // });

  it('should add user settings', async () => {
    spyOn(http, 'put').and.returnValue(of({}));
    const result = await service.addUserSetting('name', 'tester').toPromise();
    expect(result).toEqual({});
    expect(http.put).toHaveBeenCalledWith('//' + environment.backend + '/settings/', { name: 'name', value: 'tester' },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }
      });
  });

  it('should handle error on add user settings', async () => {
    spyOn(http, 'put').and.returnValue(throwError({}));
    const result = await service.addUserSetting('name', 'tester').toPromise();
    expect(result).toEqual(undefined);
    expect(http.put).toHaveBeenCalledWith('//' + environment.backend + '/settings/', { name: 'name', value: 'tester' },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }
      });
  });

  it('should get user goal stats', async () => {
    spyOn(http, 'get').and.returnValues(of("123"), of("234"), of("345"));
    const result = await service.getUserGoalStats("2022-01-01").toPromise();
    expect(result).toEqual(["123", "234", "345"]);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/settings/goalProtein',
      { params: { date: "2022-01-01" } });
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/settings/goalFat',
      { params: { date: "2022-01-01" } });
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/settings/goalCarbs',
      { params: { date: "2022-01-01" } });
  });

  it('should get sync settings', async () => {
    spyOn(http, 'get').and.returnValue(of({}));
    const result = await service.getSyncSettings('STRAVA').toPromise();
    expect(result).toEqual({});
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/settings/connectivity/STRAVA');
  });

  it('should handle error on get sync settings', async () => {
    spyOn(http, 'get').and.returnValue(throwError({}));
    const result = await service.getSyncSettings('STRAVA').toPromise();
    expect(result).toEqual(undefined);
    expect(http.get).toHaveBeenCalledWith('//' + environment.backend + '/settings/connectivity/STRAVA');
  });

  it('should store sync settings', async () => {
    spyOn(http, 'post').and.returnValue(of({}));
    const result = await service.storeSyncSettings('STRAVA', 'code').toPromise();
    expect(result).toEqual({});
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/settings/connectivity/STRAVA',
      { name: 'code', value: 'code' }, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': environment.origin,
      }
    });
  });

  it('should handle error on store sync settings', async () => {
    spyOn(http, 'post').and.returnValue(throwError({}));
    const result = await service.storeSyncSettings('STRAVA', 'code').toPromise();
    expect(result).toEqual(undefined);
    expect(http.post).toHaveBeenCalledWith('//' + environment.backend + '/settings/connectivity/STRAVA',
      { name: 'code', value: 'code' }, {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': environment.origin,
      }
    });
  });

  it('should disconnect sync settings', async () => {
    spyOn(http, 'delete').and.returnValue(of({}));
    const result = await service.disconnectSyncSettings('STRAVA').toPromise();
    expect(result).toEqual({});
    expect(http.delete).toHaveBeenCalledWith('//' + environment.backend + '/settings/connectivity/STRAVA',
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }
      });
  });

  it('should handle error on disconnect sync settings', async () => {
    spyOn(http, 'delete').and.returnValue(throwError({}));
    const result = await service.disconnectSyncSettings('STRAVA').toPromise();
    expect(result).toEqual(undefined);
    expect(http.delete).toHaveBeenCalledWith('//' + environment.backend + '/settings/connectivity/STRAVA',
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': environment.origin,
        }
      });
  });

});
