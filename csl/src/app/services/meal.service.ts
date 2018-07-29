import {Injectable, ViewChild} from'@angular/core';
import {HttpClient} from '@angular/common/http';
import {ToastService} from './toast.service';
import {Meal} from '../model/meal';

const macrologBackendUrl = '//localhost:8090/meals';

@Injectable()
export class MealService {

	constructor(private http: HttpClient,
							private toastService: ToastService) {
	}

 	public getAllMeals() {
   	return this.http.get<Meal[]>(macrologBackendUrl, { responseType: 'json' });
	}

	public insertMeal(meal: Meal) {
   	const headers = {'Content-Type': 'application/json',
   		'Access-Control-Allow-Origin': 'http://localhost:4200'
   	};

  	const options = { headers: headers };
    return this.http.post<Meal>(macrologBackendUrl + '/', meal, options).subscribe(data => {
				this.toastService.setMessage('Your meal have been saved!');
      },
      error => {
        console.log(error);
      });
	}

	public deleteMeal(meal: Meal) {
   	const headers = {'Content-Type': 'application/json',
   		'Access-Control-Allow-Origin': 'http://localhost:4200'
   	};

  	const options = { headers: headers };
    return this.http.delete<number>(macrologBackendUrl + '/' + meal.id, options).subscribe(data => {
        console.log('deleted');
      },
      error => {
        console.log(error);
      });
	}

}
