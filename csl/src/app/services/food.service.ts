import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const simpleJavaServletUrl: string = '//localhost:8090/food';

@Injectable()
export class FoodService {

	constructor(private http: HttpClient) {
		console.log('Constructor FoodService');
	}

	getAllFood() {
		return this.http.get(simpleJavaServletUrl, { responseType: 'text' });
	}

	insertFood() {
		console.log("Insert food service");

		let headers = {'Conent-Type':'applicaton/json',
			'Access-Control-Allow-Origin':'http://localhost:4200'
		};

		let params = {'name': 'dates'};
		let options = { headers: headers, params: params };
		return this.http.post(simpleJavaServletUrl + '/newFood', {'name':'dates'}, options);

  	}

}
