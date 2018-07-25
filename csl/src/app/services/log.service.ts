import {Injectable, ViewChild} from'@angular/core';
import {HttpClient} from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {StoreLogRequest} from '../model/storeLogRequest';
import {LogEntry} from '../model/logEntry';
import {ToastService} from './toast.service';

const macrologBackendUrl = '//localhost:8090/logs';

@Injectable()
export class LogService {

	constructor(private http: HttpClient,
							private toastService: ToastService) {
	}

 	getAllLogs() {
   	return this.http.get(macrologBackendUrl, { responseType: 'json' });
	}

 	getDayLogs(date) {
   	return this.http.get(macrologBackendUrl + '/day/' + date, { responseType: 'json' });
	}

	getMacros(dateFrom,dateTo) {
   	return this.http.get(macrologBackendUrl + '/macros', { params:{from:dateFrom,to:dateTo},responseType: 'json' });
	}

	public storeLogEntries(storeLogEntryRequest: StoreLogRequest[], callBack: Function) {
		console.log('In storeLogRequest');
   	const headers = {'Content-Type': 'application/json',
   		'Access-Control-Allow-Origin': 'http://localhost:4200'
   	};

  	const options = { headers: headers };
    return this.http.post<StoreLogRequest[]>(macrologBackendUrl + '/', storeLogEntryRequest, options).subscribe(data => {
				this.toastService.setMessage('The food is saved!');
        callBack();
      },
      error => {
        console.log(error);
      });
	}

	public deleteLogEntry(logEntry: LogEntry) {
		console.log('In DeleteLogEntry');
   	const headers = {'Content-Type': 'application/json',
   		'Access-Control-Allow-Origin': 'http://localhost:4200'
   	};

  	const options = { headers: headers };
    return this.http.delete<number>(macrologBackendUrl + '/' + logEntry.id, options).subscribe(data => {
        console.log('deleted');
      },
      error => {
        console.log(error);
      });
	}

}
