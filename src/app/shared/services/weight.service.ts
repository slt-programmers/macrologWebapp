import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Weight } from '../model/weight';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class WeightService {
  private http = inject(HttpClient);

  macrologBackendUrl = '//' + environment.backend + '/weight';
  activities = new Array();

  public getAllWeights() {
    return this.http.get<Weight[]>(this.macrologBackendUrl).pipe(
      catchError((error) => { return of([]); }));
  }

  public addWeight(weight: Weight): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };
    const options = { headers: headers };
    return this.http.post<Weight>(this.macrologBackendUrl + '/', weight, options).pipe(
      catchError((error) => { return of<any>(); }));
  }

  public deleteWeight(weight: Weight): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };
    const options = { headers: headers };
    return this.http.delete<number>(this.macrologBackendUrl + '/' + weight.id, options).pipe(
      catchError((error) => { return of<number>(); }));
  }
}
