import {Injectable} from'@angular/core';
import {HttpClient} from '@angular/common/http';


const simpleJavaServletUrl = '//localhost:8090/logs';

@Injectable()
export class LogService {

	constructor(private http: HttpClient) {
	}

 	getAllLogs() {
   	return this.http.get(simpleJavaServletUrl, { responseType: 'json' });
	}


}
