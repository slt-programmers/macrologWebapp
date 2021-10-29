import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreActivityRequest } from '../model/storeActivityRequest';
import { LogActivity } from '../model/logActivity';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ActivityService {

  private readonly macrologBackendUrl = '//' + environment.backend + '/activities';

  constructor(private http: HttpClient) { }

  public getActivitiesForDate(date: string): Observable<LogActivity[]> {
    return this.http.get<LogActivity[]>(this.macrologBackendUrl + '/day/' + date)
      .pipe(catchError(error => of<any>()));
  }

  public getActivitiesForDateForced(date: string) {
    return this.http.get<LogActivity[]>(this.macrologBackendUrl + '/day/' + date + '?forceSync=true')
      .pipe(catchError(error => of<any>()));
  }

  public addActivities(storeActivityRequest: StoreActivityRequest[]): Observable<LogActivity[]> {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };
    const options = { headers: headers };
    return this.http.post<StoreActivityRequest[]>(this.macrologBackendUrl + '/', storeActivityRequest, options)
      .pipe(catchError(error => of<any>()))
  }

  public deleteActivity(logActivity: LogActivity): Observable<number> {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };
    const options = { headers: headers };
    return this.http.delete<number>(this.macrologBackendUrl + '/' + logActivity.id, options)
      .pipe(catchError(error => of<any>()))
  }
}
