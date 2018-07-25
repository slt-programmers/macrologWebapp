import {Injectable} from'@angular/core';
import {HttpClient} from '@angular/common/http';
import {Food} from '../model/food';
import {ToastService} from './toast.service';

const macrologBackendUrl = '//localhost:8090/food';

@Injectable()
export class FoodService {

	constructor(private http: HttpClient,
							private toastService: ToastService) {
	}

	public addFood(addFoodRequest: Food, callBack: Function) {
		console.log('In addFood');
   	const headers = {'Content-Type': 'application/json',
   		'Access-Control-Allow-Origin': 'http://localhost:4200'
   	};

  	const options = { headers: headers };
    return this.http.post<Food>(macrologBackendUrl + '/', addFoodRequest, options).subscribe(data => {
        this.toastService.setMessage('The food has been added!');
				callBack();
      },
      error => {
        console.log(error);
      });
	}

	getFood(foodId: string) {
    console.log(macrologBackendUrl + "/" + foodId);
		return this.http.get<Food>(macrologBackendUrl + "/"+ foodId, { responseType: 'json' });
  }

 	getAllFood() {
		console.log('getAllFood');
   	return this.http.get<Food[]>(macrologBackendUrl, { responseType: 'json' });
	}

	getAllFoodNameIds() {
		let food;
		this.getAllFood().subscribe(
			data => food = data,
			error => console.log(error)
		);
	}



}
