import {Injectable, ViewChild} from'@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToastService} from './toast.service';
import {Meal} from '../model/meal';
import { environment } from '../../environments/environment';


@Injectable()
export class MealService {

  macrologBackendUrl = '//'+environment.backend+'/meals';

	constructor(private http: HttpClient,
							private toastService: ToastService) {
	}

 	public getAllMeals() {
   	return this.http.get<Meal[]>(this.macrologBackendUrl, { responseType: 'json' });
	}

	public insertMeal(meal: Meal, callBack: Function) {
   	const headers = {'Content-Type': 'application/json',
   		'Access-Control-Allow-Origin': environment.origin
   	};

  	const options = { headers: headers };
    return this.http.post<Meal>(this.macrologBackendUrl + '/', meal, options).subscribe(data => {
				this.toastService.setMessage('Your meal have been saved!');
        console.log('saved');
        callBack();
      },
      error => {
        console.log(error);
      });
	}

	public deleteMeal(meal: Meal) {
   	const headers = {'Content-Type': 'application/json',
   		'Access-Control-Allow-Origin': environment.origin
   	};

  	const options = { headers: headers };
    return this.http.delete<number>(this.macrologBackendUrl + '/' + meal.id, options).subscribe(data => {
        console.log('deleted');
      },
      error => {
        console.log(error);
      });
	}

}
