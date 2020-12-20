import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { forkJoin } from 'rxjs';
import { UserSettings } from '../model/userSettings';

@Injectable()
export class UserService {
  private macrologBackendUrl = '//' + environment.backend + '/settings';

  constructor(private http: HttpClient) {}

  public addUserSetting(key: string, value: string) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };

    const setting = { name: key, value: value };
    const options = { headers: headers };
    return this.http.put(this.macrologBackendUrl + '/', setting, options);
  }

  public getUserGoalStats(date: string) {
    return forkJoin([
      this.getSetting('goalProtein', date),
      this.getSetting('goalFat', date),
      this.getSetting('goalCarbs', date),
    ]);
  }

  public getSetting(key: string, date: string) {
    return this.http.get(this.macrologBackendUrl + '/' + key, {
      params: { date: date },
      responseType: 'json',
    });
  }

  public getSyncSettings(key: string) {
    return this.http.get<any>(
      this.macrologBackendUrl + '/connectivity/' + key,
      { responseType: 'json' }
    );
  }

  public storeSyncSettings(syncWith: string, code: string) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };

    const userInfo = { name: 'code', value: code };
    const options = { headers: headers };
    return this.http.post(
      this.macrologBackendUrl + '/connectivity/' + syncWith,
      userInfo,
      options
    );
  }
  public disconnectSyncSettings(syncWith: string) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };

    const options = { headers: headers };
    return this.http.delete(
      this.macrologBackendUrl + '/connectivity/' + syncWith,
      options
    );
  }

  public getUserInfo(key: string, date: string) {
    return this.http.get<any>(this.macrologBackendUrl + '/' + key, {
      params: { date: date },
      responseType: 'json',
    });
  }

  public getUserSettings() {
    return this.http.get<UserSettings>(this.macrologBackendUrl + '/user');
  }

  // public getExport() {
  // 	return this.http.get('//' + environment.backend + '/export');
  // }
}
