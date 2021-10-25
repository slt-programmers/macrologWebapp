import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './toast.service';
import { Weight } from '../model/weight';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class WeightService {
  macrologBackendUrl = '//' + environment.backend + '/weight';
  activities = new Array();

  constructor(private http: HttpClient, private toastService: ToastService) { }

  public getAllWeights() {
    return this.http.get<Weight[]>(this.macrologBackendUrl, { responseType: 'json' }).pipe(
      catchError((error) => {
        this.toastService.setMessage('Your weights could not be fetched!');
        return of([]);
      }));
  }

  public storeWeight(weight: Weight): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };
    const options = { headers: headers };
    return this.http.post<Weight>(this.macrologBackendUrl + '/', weight, options).pipe(
      catchError((error) => {
        this.toastService.setMessage('Your weight could not be saved!');
        return of<any>();
      }));
  }

  public deleteWeight(weight: Weight): Observable<any> {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };
    const options = { headers: headers };
    return this.http.delete<number>(this.macrologBackendUrl + '/' + weight.id, options).pipe(
      catchError((error) => {
        this.toastService.setMessage('Your weight could not be deleted!');
        return of<number>();
      }));
  }
}
