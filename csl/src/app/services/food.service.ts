import {Injectable} from'@angular/core';
import {HttpClient} from '@angular/common/http';
import {Food} from '../model/food';
import {ToastService} from './toast.service';
import { environment } from '../../environments/environment';


@Injectable()
export class FoodService {

  macrologBackendUrl = '//'+environment.backend+'/food';


	constructor(private http: HttpClient,
							private toastService: ToastService) {
	}

	public addFood(addFoodRequest: Food, callBack: Function) {
   	const headers = {'Content-Type': 'application/json',
   		'Access-Control-Allow-Origin': environment.origin
   	};

  	const options = { headers: headers };
    return this.http.post<Food>(this.macrologBackendUrl + '/', addFoodRequest, options).subscribe(data => {
        this.toastService.setMessage('The food has been added!');
				callBack();
      },
      error => {
        console.log(error);
      });
	}

	getFood(foodId: string) {
		return this.http.get<Food>(this.macrologBackendUrl + "/"+ foodId, { responseType: 'json' });
  }

 	getAllFood() {
   	return this.http.get<Food[]>(this.macrologBackendUrl, { responseType: 'json' });
	}

	getAllFoodNameIds() {
		let food;
		this.getAllFood().subscribe(
			data => food = data,
			error => console.log(error)
		);
	}



}
