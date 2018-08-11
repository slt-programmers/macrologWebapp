import {Injectable} from'@angular/core';
import {HttpClient} from '@angular/common/http';
import {Food} from '../model/food';
import {Observable} from 'rxjs/Observable';
import {forkJoin} from 'rxjs/observable/forkJoin';
import { environment } from '../../environments/environment';


@Injectable()
export class UserService {

  macrologBackendUrl = '//'+environment.backend+'/settings';

	constructor(private http: HttpClient) {
	}

	public addUserInfo(key: string, value: string) {
   	const headers = {'Content-Type': 'application/json',
   		'Access-Control-Allow-Origin': environment.origin	};

		let userInfo = { name: key, value: value };
  	const options = { headers: headers };
    return this.http.put(this.macrologBackendUrl + '/', userInfo, options);
	}

	public getUserGoalStats() {
		return forkJoin(
			this.getUserInfo('goalProtein'),
			this.getUserInfo('goalFat'),
			this.getUserInfo('goalCarbs')
		);
	}

	public getUserInfo(key: string) {
		return this.http.get(this.macrologBackendUrl + '/' + key, { responseType: 'json' });
	}

	public getAllSettings() {
		console.log('Get all settings');
		return this.http.get(this.macrologBackendUrl);
	}

	public getExport() {
		return this.http.get('//'+environment.backend+'/export');
	}

	public saveWeight(date, weight) {
		return this.http.get(this.macrologBackendUrl + '/weight', { params: {weight: weight, date: date}, responseType: 'json' });
	}
}
