import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './toast.service';
import { Dish } from '../model/dish';
import { environment } from '../../environments/environment';

@Injectable()
export class MealService {

	private macrologBackendUrl = '//' + environment.backend + '/meals';

	constructor(private http: HttpClient,
		private toastService: ToastService) {
	}

	public getAllMeals() {
		return this.http.get<Dish[]>(this.macrologBackendUrl, { responseType: 'json' });
	}

	public insertMeal(meal: Dish, callBack: Function) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const options = { headers: headers };
		return this.http.post<Dish>(this.macrologBackendUrl + '/', meal, options).subscribe(
			data => {
				this.toastService.setMessage('Your meal have been saved!');
				callBack();
			},
			error => {
				console.log(error);
			});
	}

	public deleteMeal(meal: Dish) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const options = { headers: headers };
		return this.http.delete<number>(this.macrologBackendUrl + '/' + meal.id, options).subscribe(
			data => {
			},
			error => {
				console.log(error);
			});
	}
}
