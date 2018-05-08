import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

const simpleJavaServletUrl = '//localhost:8090/food';

@Injectable()
export class FoodService {

  constructor(private http: HttpClient) {
    console.log('Constructor FoodService');
  }

  getAllFood() {
    return this.http.get(simpleJavaServletUrl, { responseType: 'json' });
  }

  insertFood() {
    console.log('Insert food service');

    const headers = {'Conent-Type': 'applicaton/json',
    'Access-Control-Allow-Origin': 'http://localhost:4200'
    };

    const params = {'name': 'dates'};
    const options = { headers: headers, params: params };
    return this.http.post(simpleJavaServletUrl + '/newFood', {'name': 'dates'}, options);

    }

}
