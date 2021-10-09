import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './toast.service';
import { Weight } from '../../model/weight';
import { environment } from '../../../environments/environment';

@Injectable()
export class WeightService {
  macrologBackendUrl = '//' + environment.backend + '/weight';
  activities = new Array();

  constructor(private http: HttpClient, private toastService: ToastService) {}

  public getAllWeights() {
    return this.http.get<Weight[]>(this.macrologBackendUrl, {
      responseType: 'json',
    });
  }
  public getDayActivities(date: string) {
    return this.http.get<any[]>(this.macrologBackendUrl + '/day/' + date);
  }

  public storeWeight(logWeight: Weight, callBack: Function) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };

    const options = { headers: headers };
    return this.http
      .post<Weight>(this.macrologBackendUrl + '/', logWeight, options)
      .subscribe(
        () => {
          this.toastService.setMessage('Your weight has been saved!');
          callBack();
        },
        () => {
          this.toastService.setMessage('Your weight could not be saved!');
        }
      );
  }

  public deleteWeight(logWeight: Weight, callBack: Function) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };

    const options = { headers: headers };

    return this.http
      .delete<number>(this.macrologBackendUrl + '/' + logWeight.id, options)
      .subscribe(
        () => {
          callBack();
        },
        () => {
          this.toastService.setMessage(
            'Your weight measurement could not be deleted!'
          );
        }
      );
  }
}
