import {Injectable} from'@angular/core';
import {HttpClient} from '@angular/common/http';
import {Food} from '../model/food';

const macrologBackendUrl = '//localhost:8090/food';

@Injectable()
export class FoodService {

	constructor(private http: HttpClient) {
	}

	public addFood(addFoodRequest: Food) {
		console.log('In addFood');
   	const headers = {'Content-Type': 'application/json',
   		'Access-Control-Allow-Origin': 'http://localhost:4200'
   	};

  	const options = { headers: headers };
    return this.http.post<Food>(macrologBackendUrl + '/', addFoodRequest, options).subscribe(data => {
        alert('ok');
      },
      error => {
        console.log(error);
      });
	}

   getFood(foodId: string) {
     console.log(macrologBackendUrl + "/" + foodId);
   	return this.http.get(macrologBackendUrl + "/"+ foodId, { responseType: 'json' });
  }


	// TODO: kijken wat uiteindelijk gebruikt wordt

 	getAllFood() {
		console.log('getFood');
   	return this.http.get(macrologBackendUrl, { responseType: 'json' });
	}


	insertFood() {
		const headers = {'Conent-Type': 'applicaton/json',
    		'Access-Control-Allow-Origin': 'http://localhost:4200'
    	};

		const params = { 'name': 'peer'};
		const options = { headers: headers, params: params };
		console.log(options);
    return this.http.post(macrologBackendUrl + '/newFood', {'name': 'dates'}, options);
	}

	insertFoodTwo(food: Food) {
   	const headers = {'Conent-Type': 'applicaton/json',
   		'Access-Control-Allow-Origin': 'http://localhost:4200'
   	};

   	const options = { headers: headers };
		console.log(options);
    return this.http.post<Food>(macrologBackendUrl + '/newFoodTwo', food, options);
	}

}
