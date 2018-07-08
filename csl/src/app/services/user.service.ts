import {Injectable} from'@angular/core';
import {HttpClient} from '@angular/common/http';
import {Food} from '../model/food';

const macrologBackendUrl = '//localhost:8090/settings';

@Injectable()
export class UserService {

	constructor(private http: HttpClient) {
	}

	public addUserInfo(key: string, value: string) {
		console.log('In addUserInfo');
   	const headers = {'Content-Type': 'application/json',
   		'Access-Control-Allow-Origin': 'http://localhost:4200'
   	};

		let userInfo = { name: key, value: value }
  	const options = { headers: headers };
    return this.http.post<Food>(macrologBackendUrl + '/', userInfo, options).subscribe(data => {
        alert('ok');
      },
      error => {
        console.log(error);
      });
	}

	public getUserInfo(key: string) {
		return this.http.get(macrologBackendUrl + '/' + key, { responseType: 'json' });
	}

	public getAllSettings() {
		return this.http.get(macrologBackendUrl);
	}

}
