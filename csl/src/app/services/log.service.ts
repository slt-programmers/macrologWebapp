import { Injectable, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { StoreLogRequest } from '../model/storeLogRequest';
import { LogEntry } from '../model/logEntry';
import { ToastService } from './toast.service';
import { environment } from '../../environments/environment';


@Injectable()
export class LogService {

	macrologBackendUrl = '//' + environment.backend + '/logs';

	constructor(private http: HttpClient,
							private toastService: ToastService) {
	}

	public getAllLogs() {
		return this.http.get(this.macrologBackendUrl, { responseType: 'json' });
	}

	public getDayLogs(date) {
		return this.http.get<any[]>(this.macrologBackendUrl + '/day/' + date);
	}

	public getMacros(dateFrom, dateTo) {
		return this.http.get(this.macrologBackendUrl + '/macros', { params: { from: dateFrom, to: dateTo }, responseType: 'json' });
	}

	public storeLogEntries(storeLogEntryRequest: StoreLogRequest[], callBack: Function) {
		const headers = {'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const options = { headers: headers };
		return this.http.post<StoreLogRequest[]>(this.macrologBackendUrl + '/', storeLogEntryRequest, options).subscribe(data => {
				this.toastService.setMessage('Your meals have been saved!');
				callBack();
			},
			error => {
				this.toastService.setMessage('Your meals could not be saved!');
				console.log(error);
			});
	}

	public deleteLogEntry(logEntry: LogEntry) {
		const headers = {'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const options = { headers: headers };
		return this.http.delete<number>(this.macrologBackendUrl + '/' + logEntry.id, options).subscribe(data => {
				console.log('deleted');
			},
			error => {
				this.toastService.setMessage('Your entry has not been deleted!');
				console.log(error);
			});
	}
}
