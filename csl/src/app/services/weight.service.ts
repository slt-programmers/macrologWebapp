import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreActivityRequest } from '../model/storeActivityRequest';
import { ToastService } from './toast.service';
import { LogActivity } from '../model/logActivity';
import { LogWeight } from '../model/logWeight';
import { environment } from '../../environments/environment';

@Injectable()
export class WeightService {

	macrologBackendUrl = '//' + environment.backend + '/weight';
  activities = new Array();

	constructor(private http: HttpClient,
							private toastService: ToastService) {
	}

	public getAllWeights() {
		return this.http.get<LogWeight[]>(this.macrologBackendUrl, { responseType: 'json' });
	}
	public getDayActivities(date) {
		return this.http.get<any[]>(this.macrologBackendUrl + '/day/' + date);
	}


	public storeWeight(logWeight: LogWeight, callBack: Function) {
		const headers = {'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};
    console.log(logWeight);

		const options = { headers: headers };
 		return this.http.post<LogWeight>(this.macrologBackendUrl + '/', logWeight, options).subscribe(data => {
				this.toastService.setMessage('Your weight has been saved!');
				callBack();
			},
			error => {
				this.toastService.setMessage('Your weight could not be saved!');
				console.log(error);
			});
	}

  public deleteLogActivity(logActivity: LogActivity) {
		const headers = {'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const options = { headers: headers };

		return this.http.delete<number>(this.macrologBackendUrl + '/' + logActivity.id, options).subscribe(data => {
				console.log('activity deleted');
			},
			error => {
				this.toastService.setMessage('Your activity could not be deleted!');
				console.log(error);
			});
	}

}
