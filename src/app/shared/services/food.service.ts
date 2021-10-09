import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Food } from '../../model/food';
import { ToastService } from './toast.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class FoodService {
  macrologBackendUrl = '//' + environment.backend + '/food';

  constructor(private http: HttpClient, private toastService: ToastService) {}

  public addFood(addFoodRequest: Food, callBack: Function) {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };

    const options = { headers: headers };
    return this.http
      .post<Food>(this.macrologBackendUrl + '/', addFoodRequest, options)
      .subscribe(
        () => {
          this.toastService.setMessage('The food has been added!');
          callBack();
        },
        () => {
          // TODO handle error
        }
      );
  }

  public getFood(foodId: string) {
    return this.http.get<Food>(this.macrologBackendUrl + '/' + foodId, {
      responseType: 'json',
    });
  }

  public getAllFood() {
    return this.http.get<Food[]>(this.macrologBackendUrl, {
      responseType: 'json',
    });
  }
}
