import {Injectable} from'@angular/core';
import {HttpClient} from '@angular/common/http';
import {Food} from '../model/food';

const simpleJavaServletUrl = '//localhost:8090/food';

@Injectable()
export class FoodService {

	constructor(private http: HttpClient) {
	}

	public addFood(addFoodRequest: Food) {
		console.log('In addFood');
   	const headers = {'Content-Type': 'applicaton/json',
   		'Access-Control-Allow-Origin': 'http://localhost:4200'
   	};

  	const options = { headers: headers };
    return this.http.post<Food>(simpleJavaServletUrl + '/', addFoodRequest.toString(), options).subscribe(data => {
        alert('ok');
      },
      error => {
        console.log(error);
      });
	}


	// TODO: kijken wat uiteindelijk gebruikt wordt

 	getAllFood() {
   	return this.http.get(simpleJavaServletUrl, { responseType: 'json' });
	}

  getFood(foodName:String) {
   	return this.http.get(simpleJavaServletUrl + "/"+ foodName, { responseType: 'json' });
  }

	insertFood() {
		const headers = {'Conent-Type': 'applicaton/json',
    		'Access-Control-Allow-Origin': 'http://localhost:4200'
    	};

		const params = { 'name': 'peer'};
		const options = { headers: headers, params: params };
		console.log(options);
    return this.http.post(simpleJavaServletUrl + '/newFood', {'name': 'dates'}, options);
	}

	insertFoodTwo(food: Food) {
   	const headers = {'Conent-Type': 'applicaton/json',
   		'Access-Control-Allow-Origin': 'http://localhost:4200'
   	};

   	const options = { headers: headers };
		console.log(options);
    return this.http.post<Food>(simpleJavaServletUrl + '/newFoodTwo', food, options);
	}

}
