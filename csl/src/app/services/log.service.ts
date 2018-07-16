import {Injectable} from'@angular/core';
import {HttpClient} from '@angular/common/http';
import { StoreLogRequest } from '../model/storeLogRequest';


const simpleJavaServletUrl = '//localhost:8090/logs';

@Injectable()
export class LogService {

	constructor(private http: HttpClient) {
	}

 	getAllLogs() {
   	return this.http.get(simpleJavaServletUrl, { responseType: 'json' });
	}
	public storeLogEntry(storeLogEntryRequest: StoreLogRequest) {
		console.log('In storeLogRequest');
   	const headers = {'Content-Type': 'application/json',
   		'Access-Control-Allow-Origin': 'http://localhost:4200'
   	};

  	const options = { headers: headers };
    return this.http.post<StoreLogRequest>(simpleJavaServletUrl + '/', storeLogEntryRequest, options).subscribe(data => {
        console.log('saved');
      },
      error => {
        console.log(error);
      });
	}


}
