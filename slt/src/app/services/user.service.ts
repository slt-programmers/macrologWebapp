import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { environment } from '../../environments/environment';

@Injectable()
export class UserService {

	macrologBackendUrl = '//' + environment.backend + '/settings';

	constructor(private http: HttpClient) {
	}

	public addUserInfo(key: string, value: string) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const userInfo = { name: key, value: value };
		const options = { headers: headers };
		return this.http.put(this.macrologBackendUrl + '/', userInfo, options);
	}

	public getUserGoalStats(date) {
		return forkJoin(
			this.getUserInfo('goalProtein', date),
			this.getUserInfo('goalFat', date),
			this.getUserInfo('goalCarbs', date)
		);
	}

  public getSyncSettings(key:string){
		return this.http.get(this.macrologBackendUrl + '/connectivity/' + key, {  responseType: 'json' });
  }

	public storeSyncSettings(syncWith:string, code: string) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const userInfo = { name: 'code', value: code};
		const options = { headers: headers };
		return this.http.post(this.macrologBackendUrl + '/connectivity/' +syncWith, userInfo, options);
	}
	public disConnectSyncSettings(syncWith:string) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const options = { headers: headers };
		return this.http.delete(this.macrologBackendUrl + '/connectivity/' +syncWith, options);
	}

	public getUserInfo(key: string, date: string) {
		return this.http.get(this.macrologBackendUrl + '/' + key, { params: { date: date }, responseType: 'json' });
	}

	public getAllSettings() {
		return this.http.get(this.macrologBackendUrl + '/user');
	}

	public getExport() {
		return this.http.get('//' + environment.backend + '/export');
	}

}
