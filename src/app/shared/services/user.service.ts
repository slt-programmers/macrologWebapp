import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { UserSettings } from '../model/userSettings';

@Injectable()
export class UserService {
  private readonly http = inject(HttpClient);

  private macrologBackendUrl = '//' + environment.backend + '/settings';

  public getSetting(key: string, date: string): Observable<string> {
    return this.http.get<string>(this.macrologBackendUrl + '/' + key,
      { params: { date: date } }).pipe(
        catchError(() => of()));
  }

  public getUserSettings(): Observable<UserSettings> {
    return this.http.get<UserSettings>(this.macrologBackendUrl + '/user').pipe(
      catchError(() => of()));
  }

  public getUserGoalStats(date: string): Observable<string[]> {
    return forkJoin([
      this.getSetting('goalProtein', date),
      this.getSetting('goalFat', date),
      this.getSetting('goalCarbs', date),
    ]);
  }

  public addUserSetting(key: string, value: string): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };

    const setting = { name: key, value: value };
    const options = { headers: headers };
    return this.http.put<any>(this.macrologBackendUrl, setting, options).pipe(
      catchError(() => { return of(); }));
  }

  public getSyncSettings(key: string): Observable<any> {
    return this.http.get<any>(this.macrologBackendUrl + '/connectivity/' + key).pipe(
      catchError(() => { return of(); }));
  }

  public storeSyncSettings(syncWith: string, code: string): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };

    const userInfo = { name: 'code', value: code };
    const options = { headers: headers };
    return this.http.post<any>(this.macrologBackendUrl + '/connectivity/' + syncWith, userInfo, options).pipe(
      catchError(() => { return of(); }));
  }

  public disconnectSyncSettings(syncWith: string): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };

    const options = { headers: headers };
    return this.http.delete<any>(this.macrologBackendUrl + '/connectivity/' + syncWith, options).pipe(
      catchError(() => { return of(); }));
  }

}
