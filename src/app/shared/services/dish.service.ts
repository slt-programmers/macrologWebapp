import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastService } from './toast.service';
import { Dish } from '../model/dish';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Injectable()
export class DishService {
  private macrologBackendUrl = '//' + environment.backend + '/dishes';

  constructor(private http: HttpClient, private toastService: ToastService) { }

  public getAllDishes(): Observable<Dish[]> {
    return this.http.get<Dish[]>(this.macrologBackendUrl).pipe(
      catchError(error => {
        return of<any>();
      }));
  }

  public addDish(dish: Dish): Observable<Dish> {
    const dishDto = {
      id: dish.id,
      name: dish.name,
      ingredients: dish.ingredients.map(ingr => {
        return {
          food: ingr.food,
          portion: ingr.portion,
          portionId: ingr.portionId,
          multiplier: ingr.multiplier
        }
      })
    }

    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };
    const options = { headers: headers };
    return this.http.post<Dish>(this.macrologBackendUrl + '/', dishDto, options).pipe(
      catchError(error => {
        return of<any>();
      }));
  }

  public deleteDish(dish: Dish):Observable<number> {
    const headers = {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': environment.origin,
    };
    const options = { headers: headers };
    return this.http.delete<number>(this.macrologBackendUrl + '/' + dish.id, options).pipe(
      catchError(error => {
        return of<any>();
      }));
  }
}
