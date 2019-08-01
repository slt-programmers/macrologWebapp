import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {

	private macrologBackendUrl = '//' + environment.backend + '/settings';

	constructor(private http: HttpClient) {
	}

	public addUserSetting(key: string, value: string) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const setting = { name: key, value: value };
		const options = { headers: headers };
		return this.http.put(this.macrologBackendUrl + '/', setting, options);
	}

	public getUserGoalStats(date: string) {
		return forkJoin(
			this.getUserSetting('goalProtein', date),
			this.getUserSetting('goalFat', date),
			this.getUserSetting('goalCarbs', date)
		);
	}

	public getUserSetting(key: string, date: string) {
		return this.http.get(this.macrologBackendUrl + '/' + key, { params: { date: date }, responseType: 'json' });
	}

	public getAllSettings() {
		return this.http.get(this.macrologBackendUrl + '/user');
	}

	// public getExport() {
	// 	return this.http.get('//' + environment.backend + '/export');
	// }

}
