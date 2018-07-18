import {Injectable} from'@angular/core';
import {HttpClient} from '@angular/common/http';
import {StoreLogRequest} from '../model/storeLogRequest';
import {LogEntry} from '../model/logEntry';

const macrologBackendUrl = '//localhost:8090/logs';

@Injectable()
export class LogService {

	constructor(private http: HttpClient) {
	}

 	getAllLogs() {
   	return this.http.get(macrologBackendUrl, { responseType: 'json' });
	}

 	getDayLogs(date) {
   	return this.http.get(macrologBackendUrl + '/day/'+date, { responseType: 'json' });
	}
	public storeLogEntry(storeLogEntryRequest: StoreLogRequest) {
		console.log('In storeLogRequest');
   	const headers = {'Content-Type': 'application/json',
   		'Access-Control-Allow-Origin': 'http://localhost:4200'
   	};

  	const options = { headers: headers };
    return this.http.post<StoreLogRequest>(macrologBackendUrl + '/', storeLogEntryRequest, options).subscribe(data => {
        console.log('saved');
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
