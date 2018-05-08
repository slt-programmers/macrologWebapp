import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Food } from '../model/food';

const simpleJavaServletUrl = '//localhost:8090/food';

@Injectable()
export class FoodService {

  constructor(private http: HttpClient) {
    console.log('Constructor FoodService');
  }

  getAllFood() {
    return this.http.get(simpleJavaServletUrl, { responseType: 'json' });
  }

  insertFood(food: Food) {
    const headers = {'Conent-Type': 'applicaton/json',
    	'Access-Control-Allow-Origin': 'http://localhost:4200'
    };

    const params = {'name': 'dates'};
    const options = { headers: headers };
	console.log(options);
//    return this.http.post(simpleJavaServletUrl + '/newFood', {'name': 'dates'}, options);
    return this.http.post(simpleJavaServletUrl + '/newFoodTwo', food, options);

    }

}
