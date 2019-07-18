import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreActivityRequest } from '../model/storeActivityRequest';
import { ToastService } from './toast.service';
import { LogActivity } from '../model/logActivity';
import { environment } from '../../environments/environment';

@Injectable()
export class ActivityService {

	private macrologBackendUrl = '//' + environment.backend + '/activities';

	constructor(private http: HttpClient,
		private toastService: ToastService) {
	}

	public getAllActivities() {
		return this.http.get<LogActivity[]>(this.macrologBackendUrl, { responseType: 'json' });
	}
	public getDayActivities(date: Date) {
		return this.http.get<any[]>(this.macrologBackendUrl + '/day/' + date);
	}

	public storeLogActivities(storeActivityRequest: StoreActivityRequest[], callBack: Function) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};
		const options = { headers: headers };
		return this.http.post<StoreActivityRequest[]>(this.macrologBackendUrl + '/', storeActivityRequest, options).subscribe(
			() => {
				this.toastService.setMessage('Your activities have been saved!');
				callBack();
			},
			error => {
				console.log(error);
			});
	}

	public deleteLogActivity(logActivity: LogActivity) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};
		const options = { headers: headers };
		return this.http.delete<number>(this.macrologBackendUrl + '/' + logActivity.id, options).subscribe(
			() => {
			},
			error => {
				console.log(error);
			});
	}

}
