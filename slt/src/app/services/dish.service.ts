import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './toast.service';
import { Dish } from '../model/dish';
import { StoreDishRequest } from '../model/storeDishRequest';
import { environment } from '../../environments/environment';

@Injectable()
export class DishService {

	private macrologBackendUrl = '//' + environment.backend + '/dishes';

	constructor(private http: HttpClient,
		private toastService: ToastService) {
	}

	public getAllDishes() {
		return this.http.get<Dish[]>(this.macrologBackendUrl, { responseType: 'json' });
	}

	public insertDish(storeDishRequest: StoreDishRequest, callBack: Function) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const options = { headers: headers };
		return this.http.post<StoreDishRequest>(this.macrologBackendUrl + '/', storeDishRequest, options).subscribe(
			data => {
				this.toastService.setMessage('Your dish have been saved!');
				callBack();
			},
			error => {
				console.log(error);
			});
	}

	public deleteDish(dish: Dish) {
		const headers = {
			'Content-Type': 'application/json',
			'Access-Control-Allow-Origin': environment.origin
		};

		const options = { headers: headers };
		return this.http.delete<number>(this.macrologBackendUrl + '/' + dish.id, options).subscribe(
			data => {
			},
			error => {
				console.log(error);
			});
	}
}
