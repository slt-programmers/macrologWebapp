import {Injectable} from'@angular/core';
import {HttpClient} from '@angular/common/http';
import {Food} from '../model/food';
import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';

const macrologBackendUrl = '//localhost:8090/settings';

@Injectable()
export class UserService {

	constructor(private http: HttpClient) {
	}

	public addUserInfo(key: string, value: string) {
   	const headers = {'Content-Type': 'application/json',
   		'Access-Control-Allow-Origin': 'http://localhost:4200'	};

		let userInfo = { name: key, value: value };
  	const options = { headers: headers };
    return this.http.put(macrologBackendUrl + '/', userInfo, options);
	}

	public getUserGoalStats() {
		return forkJoin(
			this.getUserInfo('goalProtein'),
			this.getUserInfo('goalFat'),
			this.getUserInfo('goalCarbs')
		);
	}

	public getUserInfo(key: string) {
		return this.http.get(macrologBackendUrl + '/' + key, { responseType: 'json' });
	}

	public getAllSettings() {
		console.log('Get all settings');
		return this.http.get(macrologBackendUrl);
	}

	public getExport() {
		return this.http.get('//localhost:8090/export');
	}

	public saveWeight(date, weight) {
		return this.http.get(macrologBackendUrl + '/weight', { params: {weight: weight, date: date}, responseType: 'json' });
	}
}
