import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { GoogleStatus } from '@app/model/googleStatus';


@Injectable()
export class GoogleService {

	private macrologBackendUrl = '//' + environment.backend + '/admin/mail';


	constructor(private http: HttpClient) {

	}

	public getStatus() {
    console.log(this.macrologBackendUrl);
		return this.http.get<GoogleStatus>(this.macrologBackendUrl, { responseType: 'json' });
	}

	public storeMailSyncSettings(code: string) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const userInfo = { name: 'code', value: code };
		const options = { headers: headers };
		return this.http.post(this.macrologBackendUrl, userInfo, options);
	}
	public sendTestMail(mailAddress: string) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const userInfo = { name: 'mailAdress', value: mailAddress };
		const options = { headers: headers };
		return this.http.post(this.macrologBackendUrl+"/testmail", userInfo, options);
	}

}
