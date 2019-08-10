import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { StoreLogRequest } from '../model/storeLogRequest';
import { LogEntry } from '../model/logEntry';
import { ToastService } from './toast.service';
import { environment } from '../../environments/environment';
import { MacrosPerDay } from '@app/model/macrosPerDay';


@Injectable()
export class DiaryService {

	macrologBackendUrl = '//' + environment.backend + '/logs';

	constructor(private http: HttpClient,
		private toastService: ToastService) {
	}

	public getLogsForDay(date: string) {
		return this.http.get<LogEntry[]>(this.macrologBackendUrl + '/day/' + date);
	}

	public getMacrosPerDay(dateFrom: string, dateTo: string) {
		return this.http.get<MacrosPerDay[]>(this.macrologBackendUrl + '/macros', { params: { from: dateFrom, to: dateTo }, responseType: 'json' });
	}

	public storeLogEntries(storeLogEntryRequest: StoreLogRequest[], callBack: Function) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const options = { headers: headers };
		return this.http.post<StoreLogRequest[]>(this.macrologBackendUrl + '/', storeLogEntryRequest, options).subscribe(
			() => {
				this.toastService.setMessage('Your meals have been saved!');
				callBack();
			},
			error => {
				this.toastService.setMessage('Your meals could not be saved!');
				console.log(error);
			});
	}

	public deleteLogEntry(logEntry: LogEntry) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const options = { headers: headers };
		return this.http.delete<number>(this.macrologBackendUrl + '/' + logEntry.id, options).subscribe(
			() => { },
			error => {
				this.toastService.setMessage('Your entry has not been deleted!');
				console.log(error);
			});
	}
}
