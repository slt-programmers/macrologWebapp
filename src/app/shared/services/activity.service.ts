import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Activity } from '../model/activity';
import { environment } from '../../../environments/environment';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { DatePipe } from '@angular/common';

@Injectable()
export class ActivityService {

  private readonly macrologBackendUrl = '//' + environment.backend + '/activities';

  constructor(private http: HttpClient) { }

  public getActivitiesForDate(date: string): Observable<Activity[]> {
    return this.http.get<Activity[]>(this.macrologBackendUrl + '/day/' + date)
      .pipe(catchError(error => of<any>()));
  }

  public getActivitiesForDateForced(date: string) {
    return this.http.get<Activity[]>(this.macrologBackendUrl + '/day/' + date + '?forceSync=true')
      .pipe(catchError(error => of<any>()));
  }

  public addActivities(activities: Activity[]): Observable<Activity[]> {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };
    const pipe = new DatePipe('en-US');
    const request = activities.map(act => {
      act.day = pipe.transform(act.day, 'yyyy-MM-dd') as any;
    })
    const options = { headers: headers };
    return this.http.post<Activity[]>(this.macrologBackendUrl + '/', request, options)
      .pipe(catchError(error => of<any>()))
  }

  public deleteActivity(activity: Activity): Observable<number> {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };
    const options = { headers: headers };
    return this.http.delete<number>(this.macrologBackendUrl + '/' + activity.id, options)
      .pipe(catchError(error => of<any>()))
  }
}
