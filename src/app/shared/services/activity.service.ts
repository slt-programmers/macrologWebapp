import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { Activity } from "../model/activity";

@Injectable()
export class ActivityService {
  private readonly http = inject(HttpClient);
  private readonly backendUrl = "//" + environment.backend + "/activities";

  getActivitiesForDay(date: string, sync = false): Observable<Activity[]> {
    const syncUrl = sync ? '?forceSync=true' : ''
    return this.http.get<Activity[]>(this.backendUrl + '/day/' + date + syncUrl);
  }

  postActivitiesForDay(date: string, activities: Activity[]): Observable<Activity[]> {
    return this.http.post<Activity[]>(this.backendUrl + '/day/' + date, activities)
  }
}